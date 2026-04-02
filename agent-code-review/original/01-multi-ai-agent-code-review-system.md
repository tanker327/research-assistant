# Multi-AI Agent Code Review System, Generative AI

> **Author:** Mehul Gupta | **Published in:** Data Science in Your Pocket | **Date:** May 27, 2024 | **Claps:** 231  
> **Source:** https://medium.com/data-science-in-your-pocket/multi-ai-agent-code-review-system-generative-ai-d0f3d6c84597

## codes explained using LangGraph

Generative AI, especially LLMs, have opened up a number of new directions to explore. One of my favourite is solving complex product problems using Multi-Agent Orchestration. I've already covered the basics of [Multi-Agent Orchestration](https://medium.com/data-science-in-your-pocket/multi-agent-orchestration-conversations-using-autogen-crewai-and-langgraph-3ca1c7026eaf) alongside dummy prototypes of [Movie-Scripting](https://medium.com/data-science-in-your-pocket/multi-agent-movie-scripting-using-generative-ai-with-codes-ab9df05f5480), Product Brainstorming, [Interview System](https://medium.com/data-science-in-your-pocket/ai-interview-system-using-generative-ai-d3d8188479b0), etc. In this post, I will be sharing about building a Code Review system using Multiple AI Agents where one of them will act as a Coder and the other as Reviewer.

The flow would look something like this:

> The Coder will start off with a code script (any language)
>
> The Reviewer will review the code and suggest changes
>
> The Coder, considering the suggestions, re-writes the code and submit for review to Reviewer
>
> The cycle continues until either 1) No issues are found 2) 'N' iterations are done

**Note**: Before we jump onto codes, you should go through the below tutorials which are a pre-requisite to understand and use the codes in this post.

We will be using Gemini's free API in this tutorial.

We will be using LangGraph for building the Multi-Agent Orchestration system.

### 1. Import required functions and setup Gemini's API

```python
from typing import Dict, TypedDict, Optional
from langgraph.graph import StateGraph, END
import random
import time
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI

GOOGLE_API_KEY = ''
genai.configure(api_key=GOOGLE_API_KEY)
model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)

def llm(x):
    return model.invoke(x).content
```

### 2. Define StateGraph variables

```python
class GraphState(TypedDict):
    feedback: Optional[str] = None
    history: Optional[str] = None
    code: Optional[str] = None
    specialization: Optional[str] = None
    rating: Optional[str] = None
    iterations: Optional[int] = None
    code_compare: Optional[str] = None
    actual_code: Optional[str] = None

workflow = StateGraph(GraphState)
```

Some important ones used here are:

- **feedback:** Reviewer's feedback on submitted code
- **history:** Save entire logs
- **code:** Current iteration's code by Coder
- **rating:** Coder rating given by Reviewer in the end
- **code_compare:** Comparing input and output code quality

### 3. Define prompts and graph nodes

```python
reviewer_start = "You are Code reviewer specialized in {}.\
You need to review the given code following PEP8 guidelines and potential bugs\
and point out issues as bullet list.\
Code:\n {}"

coder_start = "You are a Coder specialized in {}.\
Improve the given code given the following guidelines. Guideline:\n {} \n \
Code:\n {} \n \
Output just the improved code and nothing else."

rating_start = "Rate the skills of the coder on a scale of 10 given the Code review cycle with a short reason.\
Code review:\n {} \n "

code_comparison = "Compare the two code snippets and rate on a scale of 10 to both. Dont output the codes.\
Revised Code: \n {} \n Actual Code: \n {}"

classify_feedback = "Are all feedback mentioned resolved in the code? Output just Yes or No.\
Code: \n {} \n Feedback: \n {} \n"

def handle_reviewer(state):
    history = state.get('history', '').strip()
    code = state.get('code', '').strip()
    specialization = state.get('specialization', '').strip()
    iterations = state.get('iterations')

    print("Reviewer working...")

    feedback = llm(reviewer_start.format(specialization, code))

    return {
        'history': history + "\n REVIEWER:\n" + feedback,
        'feedback': feedback,
        'iterations': iterations + 1
    }

def handle_coder(state):
    history = state.get('history', '').strip()
    feedback = state.get('feedback', '').strip()
    code = state.get('code', '').strip()
    specialization = state.get('specialization', '').strip()

    print("CODER rewriting...")

    code = llm(coder_start.format(specialization, feedback, code))

    return {
        'history': history + '\n CODER:\n' + code,
        'code': code
    }

def handle_result(state):
    print("Review done...")

    history = state.get('history', '').strip()
    code1 = state.get('code', '').strip()
    code2 = state.get('actual_code', '').strip()
    rating = llm(rating_start.format(history))

    code_compare = llm(code_comparison.format(code1, code2))

    return {'rating': rating, 'code_compare': code_compare}
```

Let's understand the nodes one by one:

- **handle_reviewer**: This node handles Reviewer's response which detects issues in current code submitted by Coder
- **handle_coder:** Handles Coder's re-written code incorporating Reviewer's suggestions
- **handle_result:** Generates a rating for the Coder's skill and compares the quality of the input vs the final output code once the review is over

### 4. Add nodes to workflow

```python
workflow.add_node("handle_reviewer", handle_reviewer)
workflow.add_node("handle_coder", handle_coder)
workflow.add_node("handle_result", handle_result)
```

### 5. Defining conditional edges

```python
def deployment_ready(state):
    deployment_ready = 1 if 'yes' in llm(
        classify_feedback.format(state.get('code'), state.get('feedback'))
    ) else 0
    total_iterations = 1 if state.get('iterations') > 5 else 0
    return "handle_result" if deployment_ready or total_iterations else "handle_coder"

workflow.add_conditional_edges(
    "handle_reviewer",
    deployment_ready,
    {
        "handle_result": "handle_result",
        "handle_coder": "handle_coder"
    }
)

workflow.set_entry_point("handle_reviewer")
workflow.add_edge('handle_coder', "handle_reviewer")
workflow.add_edge('handle_result', END)
```

The only conditional edge added helps in terminating the back-and-forth code review based on 2 conditions:

> If no issues are found by Reviewer
>
> If 5 rounds of code review are done

If any of the condition is met, the Reviewer stops.

### 6. Compile and run

```python
specialization = 'python'
problem = 'Generate code to train a Regression ML model using a tabular dataset following required preprocessing steps.'
code = llm(problem)

app = workflow.compile()
conversation = app.invoke(
    {
        "history": code,
        "code": code,
        "actual_code": code,
        "specialization": specialization,
        "iterations": 0
    },
    {"recursion_limit": 100}
)
```

In this code snippet, we are:

- Generating a dummy code script using LLM for demo purpose
- Compiling the graph
- Invoking the graph with default values for StateGraph variables

Below are some important outputs from this system.

## Code (Input)

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression

# Load the tabular dataset
df = pd.read_csv('tabular_data.csv')

# Preprocessing steps
# Handle missing values if any
df = df.dropna()

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    df.drop('target', axis=1), df['target'], test_size=0.2, random_state=42
)

# Create a pipeline for preprocessing and modeling
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['numerical_feature1', 'numerical_feature2']),
        ('cat', OneHotEncoder(sparse=False), ['categorical_feature1', 'categorical_feature2'])
    ]
)

model = Pipeline(steps=[
    ('preprocessing', preprocessor),
    ('model', LinearRegression())
])

# Train the model
model.fit(X_train, y_train)

# Evaluate the model on the test set
score = model.score(X_test, y_test)
print(f"Model score on test set: {score}")

# Save the trained model
import pickle
with open('regression_model.pkl', 'wb') as f:
    pickle.dump(model, f)
```

## Refined code (Output)

```python
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from joblib import dump
import logging

# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Load the tabular dataset
try:
    df = pd.read_csv('tabular_data.csv')
except FileNotFoundError:
    logger.error("The 'tabular_data.csv' file was not found.")
    raise

# Preprocessing steps
# Handle missing values if any
df = df.dropna()

# Check if the required columns are present in the DataFrame
required_columns = [
    'numerical_feature1', 'numerical_feature2',
    'categorical_feature1', 'categorical_feature2', 'target'
]
if not set(required_columns).issubset(df.columns):
    logger.error("The DataFrame does not contain all the required columns.")
    raise ValueError("The DataFrame does not contain all the required columns.")

# Split the data into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(
    df.drop('target', axis=1), df['target'], test_size=0.2, random_state=42
)

# Create a pipeline for preprocessing and modeling
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['numerical_feature1', 'numerical_feature2']),
        ('cat', OneHotEncoder(sparse=True), ['categorical_feature1', 'categorical_feature2'])
    ]
)

model = Pipeline(steps=[
    ('preprocessing', preprocessor),
    ('model', LinearRegression())
])

# Train the model
try:
    model.fit(x_train, y_train)
except ValueError as e:
    logger.error(f"Error fitting the model: {e}")
    raise

# Evaluate the model on the test set
try:
    score = model.score(x_test, y_test)
except ValueError as e:
    logger.error(f"Error evaluating the model: {e}")
    raise

logger.info(f"Model score on test set: {score}")

# Save the trained model
try:
    dump(model, 'regression_model.joblib')
except Exception as e:
    logger.error(f"Error saving the model: {e}")
    raise
```

## Comparing codes

```python
print(conversation['code_compare'])
```

**Revised Code: 9/10**

- **Improved error handling**: The revised code uses try-except blocks to handle potential errors during data loading, model fitting, evaluation, and model saving. This helps to ensure that the code fails gracefully and provides useful error messages.
- **Logging**: The revised code includes logging to provide a record of the execution, including errors and important events. This can be helpful for debugging and monitoring the performance of the code.
- **Improved data validation**: The revised code checks if the required columns are present in the DataFrame before proceeding with preprocessing and modeling. This helps to prevent errors that could occur due to missing or incorrect data.

**Actual Code: 7/10**

- **No error handling**: The code lacks error handling, which can make it difficult to debug and understand the cause of failures.
- **No logging**: The code does not include logging, which makes it harder to track the execution of the code and identify potential issues.
- **Data validation is not as robust**: The code does not check if the required columns are present in the DataFrame, which could lead to errors later in the pipeline.

As you can see, the system actually helped us to improve the code quality automatically and on evaluation, the overall code rating has improved (from 7 to 9).

Finally, the flow for graph execution looks like this:

![Graph execution flow](https://miro.medium.com/v2/resize:fit:700/1*7lt9SKsF2YqZAXcjfOcWwg.png)

With this, it's a wrap. Before leaving, I do have a few suggestions that you can try out on your own to add in this system:

- Include code execution using Tools in LangChain
- Handle multiple code files
- Try changing the conditional criteria (maybe code rating reaches X threshold) before ending the review, etc
