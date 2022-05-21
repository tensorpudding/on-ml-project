# Roadmap for ML Project

* COMPLETE: Train CNN ML model
* COMPLETE: Python server using WS API
* WORKING: JS Canvas

## Currently working on:

* Docker Compose - better workflow
* Make it pretty: flesh out CSS layout, make it more sane
* Remove the dynamic resize and give up on mobile working right
* Maybe painbrush should draw at pointer center, rather than left corner?
* Update training: load saved model, train with new supervised samples, and reload.
  - https://stackoverflow.com/questions/62708611/how-do-i-retrain-an-already-trained-tensorflow-model-with-new-data
* Trying to figure out how to respond to SIGTERM/SIGINT to save model on tf-server.py?
  - Train-as-you-go with user-provided ground truth: expand the WS API to include this DONE
  - Handle daemon exit with model-save routine: what is the best practice?
    - Need to have checkpointed versions? Is this helpful?
    - Current idea: handle SIGTERM/SIGINT using python's signal library, to do model saving before shutdown
    - How does this conflict with async/await?

# ML Phase: tensorflow:

## Design notes for model:

- Model will use [convolutional neural networks](https://towardsdatascience.com/convolutional-neural-networks-explained-9cc5188c4939).
- CNN layout: 
    - convolution layer with kernel with ReLU activation followed by pooling, one or more times
    - flatten layer removed 2D
    - classification layer using fully-connected neurons and ReLU activation
    - output layer to N=10 neurons using softmax activation
- We can create an ensemble of models which have different layers
- Hyperparameter tuning: use [keras-tuner](https://keras.io/guides/keras_tuner/getting_started/)
- Evaluate model on testing data.

## Training requirements:

I installed these through Anaconda, it should be possible to get these directly from pip, instead.
Only tested this on macOS, could not get this to work on Linux yet. Haven't tried Windows at all.

Python 3, ideally 3.8 or higher
numpy
tensorflow > 2.0
tensorflow_datasets
keras
keras-tuner
opencv (when we implement realtime user input)

## Deliverables:

- Fit model to MNIST, with high accuracy on testing data (difficulty: mild)
- Deploy model with OpenCV to allow for realtime prediction based on user input (difficulty: moderate)
- Develop a REST API using Flask hosted on Azure/AWS, then add functionality to website to interact with
    model using JS/canvas input (difficulty: high)