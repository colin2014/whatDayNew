from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Render the template and store it in a variable
    rendered_html = render_template('basic.html')
    
    # Print the rendered HTML to the console
    print(rendered_html)
    
    # Return the rendered HTML to the browser
    return rendered_html

if __name__ == '__main__':
    app.run(debug=True)
