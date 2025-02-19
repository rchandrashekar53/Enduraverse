from twilio.rest import Client
# for testing


account_sid = 'your_account_sid'  
auth_token = 'your_auth_token'      
twilio_number = 'your_twilio_number'  


client = Client(account_sid, auth_token)


to_number = 'recipient_phone_number'  


twiml_url = 'http://demo.twilio.com/docs/voice.xml'  
try:
    
    call = client.calls.create(
        to=to_number,
        from_=twilio_number,
        url=twiml_url
    )
    print(f"Call initiated: {call.sid}")
except Exception as e:
    print(f"An error occurred: {e}")