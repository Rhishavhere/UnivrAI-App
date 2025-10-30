from flask import Flask, request, jsonify
from flask_cors import CORS
from plyer import notification
import threading
import os
import sys

app = Flask(__name__)
CORS(app)

def play_alarm_sound():
    """Play an alarm sound using the system beep"""
    try:
        # For Windows
        if sys.platform == 'win32':
            import winsound
            # Play beep sound at 1000Hz for 1 second, repeat 5 times
            for _ in range(5):
                winsound.Beep(1000, 500)
        # For Linux
        elif sys.platform == 'linux':
            os.system('paplay /usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga 2>/dev/null || beep -f 1000 -l 500 -r 5')
        # For macOS
        elif sys.platform == 'darwin':
            os.system('afplay /System/Library/Sounds/Alarm.aiff')
    except Exception as e:
        print(f"Error playing sound: {e}")

def show_notification(message):
    """Show a desktop notification with the received message"""
    try:
        notification.notify(
            title='SOS ALARM',
            message=f'ALARM: {message}',
            app_name='SOS Server',
            timeout=10
        )
    except Exception as e:
        print(f"Error showing notification: {e}")

def trigger_alarm(message):
    """Trigger both sound alarm and notification"""
    # Play sound in a separate thread to not block the response
    sound_thread = threading.Thread(target=play_alarm_sound)
    sound_thread.daemon = True
    sound_thread.start()

    # Show notification
    show_notification(message)

@app.route('/sos', methods=['POST', 'GET'])
def sos_handler():
    """Handle SOS requests"""
    try:
        # Get message from request
        if request.method == 'POST':
            data = request.get_json() if request.is_json else {}
            message = data.get('message', request.form.get('message', 'Emergency SOS triggered!'))
        else:  # GET request
            message = request.args.get('message', 'Emergency SOS triggered!')

        # Trigger alarm and notification
        trigger_alarm(message)

        print(f"SOS received: {message}")

        return jsonify({
            'status': 'success',
            'message': 'SOS alarm triggered',
            'received_message': message
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("SOS Server starting...")
    print("Listening on http://localhost:5000/sos")
    print("Press Ctrl+C to stop")
    app.run(host='0.0.0.0', port=5000, debug=True)
