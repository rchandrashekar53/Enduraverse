import time
import numpy as np

def calculate_safety_score(accel_x, accel_y, accel_z, prev_accel_magnitude, prev_time, speed, speed_limit):
    current_time = time.time()
    time_diff = current_time - prev_time if prev_time else 1  

    accel_magnitude = np.sqrt(accel_x**2 + accel_y**2 + accel_z**2)

   
    jerk = (accel_magnitude - prev_accel_magnitude) / time_diff if prev_accel_magnitude else 0

 
    braking_force = -accel_z  

  
    score = 100  

    if accel_magnitude > 3:
        score -= 10  
    if braking_force > 2:
        score -= 10 
    if abs(jerk) > 2:
        score -= 15 
    
   
    if speed > speed_limit:
        score -= 20  

    score = max(0, score) 

    return score, accel_magnitude, current_time


prev_accel_magnitude = None
prev_time = None
safety_scores = []
speed = 0 
speed_limit = 60 

try:
    while True:
       
        accel_x, accel_y, accel_z = np.random.uniform(-5, 5, 3)  

     
        speed += accel_x * 0.1  

        safety_score, prev_accel_magnitude, prev_time = calculate_safety_score(
            accel_x, accel_y, accel_z, prev_accel_magnitude, prev_time, speed, speed_limit
        )

        safety_scores.append(safety_score)
        print(f"Speed: {speed:.2f} km/h | Safety Score: {safety_score}")

        time.sleep(1)  
except KeyboardInterrupt:
    final_safety_score = np.mean(safety_scores) if safety_scores else 100
    print(f"Final Average Safety Score: {final_safety_score:.2f}")
