from flask import Flask, jsonify, request
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import re

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/get_transcript', methods=['POST'])
def get_transcript():
    try:
        # Extract the video URL from the request
        video_url = request.json.get('url')
        
        if not video_url:
            return jsonify({'error': 'No URL provided'}), 400
        
        # Extract video ID using the helper function
        video_id = extract_video_id(video_url)
        
        if not video_id:
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # Fetch the transcript for the video
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Format the transcript into text with timestamps
        formatted_transcript = format_transcript_with_timestamps(transcript)
        
        return jsonify({'transcript': formatted_transcript})

    except Exception as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

def extract_video_id(url):
    """
    Extracts video ID from a YouTube URL.
    Supports both regular and shortened YouTube URLs.
    """
    regex = r'(?:https?://(?:www\.)?youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)'
    match = re.search(regex, url)
    if match:
        return match.group(1)  # Return the video ID
    return None

def format_transcript_with_timestamps(transcript):
    """
    Formats the transcript by including timestamps for each segment.
    """
    formatted_text = ""
    for segment in transcript:
        start_time = segment['start']
        end_time = start_time + segment['duration']
        text = segment['text']

        # Convert the start and end time to a more readable format (mm:ss)
        start_minute = int(start_time // 60)
        start_second = int(start_time % 60)
        end_minute = int(end_time // 60)
        end_second = int(end_time % 60)

        formatted_text += f"[{start_minute:02d}:{start_second:02d} - {end_minute:02d}:{end_second:02d}] {text}\n"
    
    return formatted_text

if __name__ == '__main__':
    app.run(debug=True)
