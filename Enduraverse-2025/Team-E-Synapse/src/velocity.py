import time
import numpy as np
import pandas as pd

def calculate_speed(accel_x, accel_y, accel_z, prev_velocity, time_diff):

    velocity_x = prev_velocity[0] + accel_x * time_diff
    velocity_y = prev_velocity[1] + accel_y * time_diff
    velocity_z = prev_velocity[2] + accel_z * time_diff
    

    speed = np.sqrt(velocity_x**2 + velocity_y**2 + velocity_z**2)
    
    return (velocity_x, velocity_y, velocity_z), speed


df = pd.read_csv("mpu6050_data_merged.csv") 
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
df = df.sort_values(by='Timestamp')
df['Time_Diff'] = df['Timestamp'].diff().dt.total_seconds().fillna(1)

prev_velocity = (0, 0, 0)

for index, row in df.iterrows():
    accel_x, accel_y, accel_z = row['Accel X (m/s^2)'], row['Accel Y (m/s^2)'], row['Accel Z (m/s^2)']
    time_diff = row['Time_Diff']
    
    prev_velocity, speed = calculate_speed(accel_x, accel_y, accel_z, prev_velocity, time_diff)
    
    print(f"Timestamp: {row['Timestamp']}, Speed is : {speed:.2f} m/s")
