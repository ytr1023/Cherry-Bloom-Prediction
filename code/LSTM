import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Load and preprocess the data
clean = pd.read_csv("washington_cleaned.csv")
clean = clean[["Average.Temperature", "Total.Precipitation", "Humidity..rh.", "WhetherBloom"]]
train_size = len(clean["WhetherBloom"]) - 15  # Use the last 15 days as the test set
x_train = clean.loc[0:train_size-1, ["Average.Temperature", "Total.Precipitation", "Humidity..rh."]].values
y_train = clean.loc[0:train_size-1, "WhetherBloom"].values
x_test = clean.loc[train_size:, ["Average.Temperature", "Total.Precipitation", "Humidity..rh."]].values
y_test = clean.loc[train_size:, "WhetherBloom"].values

# Normalize the input variables
max_value = np.max(x_train, axis=0)
min_value = np.min(x_train, axis=0)
spread = max_value - min_value
x_train_norm = (x_train - min_value) / spread
x_test_norm = (x_test - min_value) / spread

# Define the model architecture
model = keras.Sequential()
model.add(layers.LSTM(units=32, input_shape=(1, 3)))
model.add(layers.Dense(units=1))

# Compile the model
model.compile(
  loss="mse",
  optimizer=keras.optimizers.Adam(lr=0.001),
  metrics=["mse", "mae"]
)

# Train the model
history = model.fit(
  x=x_train_norm.reshape(-1, 1, 3),
  y=y_train,
  epochs=100,
  batch_size=16,
  validation_data=(x_test_norm.reshape(-1, 1, 3), y_test),
  shuffle=False
)

# Plot the training and validation loss over time
import matplotlib.pyplot as plt
plt.plot(history.history["loss"])
plt.plot(history.history["val_loss"])
plt.title("Model loss")
plt.ylabel("Loss")
plt.xlabel("Epoch")
plt.legend(["Train", "Validation"], loc="upper right")
plt.show()

# Evaluate the model on the test set
y_pred = model.predict(x_test_norm.reshape(-1, 1, 3))
mse = np.mean((y_pred - y_test)**2)
mae = np.mean(np.abs(y_pred - y_test))
print("Test set MSE:", mse)
print("Test set MAE:", mae)
