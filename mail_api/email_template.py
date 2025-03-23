"""
Email template generation for Hackbuddy call summaries.
"""

def generate_email_html(user_name, call_summary, extracted_skills, transcript):
    """
    Generate HTML email for call summary.
    
    Args:
        user_name (str): The recipient's name
        call_summary (str): AI-generated summary of the call
        extracted_skills (list): List of skills extracted from the conversation
        transcript (str): The full call transcript
        
    Returns:
        str: HTML content for the email
    """
    # Format the skills as a comma-separated list
    skills_text = ", ".join(extracted_skills) if extracted_skills else "No specific skills detected"
    
    # Format the transcript with line breaks
    formatted_transcript = transcript.replace('\n', '<br>')
    
    # HTML template for the email
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Hackbuddy Call Summary</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #4F46E5, #7C3AED);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
            }}
            .content {{
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-top: none;
                border-radius: 0 0 8px 8px;
                padding: 20px;
            }}
            .section {{
                margin-bottom: 25px;
            }}
            h1 {{
                font-size: 24px;
                margin: 0;
            }}
            h2 {{
                font-size: 20px;
                color: #4F46E5;
                margin-top: 0;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 8px;
            }}
            .skills {{
                background-color: #f5f7ff;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 20px;
            }}
            .skills-list {{
                font-weight: 500;
                color: #4F46E5;
            }}
            .transcript {{
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 6px;
                max-height: 300px;
                overflow-y: auto;
                font-size: 14px;
                white-space: pre-line;
            }}
            .footer {{
                text-align: center;
                font-size: 12px;
                color: #888;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Your Hackbuddy Call Summary</h1>
        </div>
        <div class="content">
            <div class="section">
                <p>Hello {user_name},</p>
                <p>Thank you for using Hackbuddy! Here's a summary of your recent call with our AI assistant.</p>
            </div>
            
            <div class="section">
                <h2>Call Summary</h2>
                <p>{call_summary}</p>
            </div>
            
            <div class="section">
                <h2>Skills Mentioned</h2>
                <div class="skills">
                    <p>Based on your conversation, we identified these skills:</p>
                    <p class="skills-list">{skills_text}</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Full Transcript</h2>
                <div class="transcript">
                    {formatted_transcript}
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated message from Hackbuddy. Please do not reply to this email.</p>
                <p>© 2023 Hackbuddy. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html 