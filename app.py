from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime

app = Flask(
    __name__,
    template_folder='frontend',  # folder index.html
    static_folder='frontend'     # folder script.js
)
CORS(app)

tasks = []

def sort_tasks():
    for task in tasks:
        task["deadline_dt"] = datetime.strptime(task["deadline"], "%Y-%m-%d")
    tasks.sort(key=lambda x: (x["deadline_dt"], -x["priority"]))
    for task in tasks:
        del task["deadline_dt"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    task = data.get('task')
    deadline = data.get('deadline')
    priority = data.get('priority')

    if not task or not deadline or priority is None:
        return jsonify({"error": "Missing data"}), 400

    try:
        datetime.strptime(deadline, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format, gunakan YYYY-MM-DD"}), 400

    try:
        priority = int(priority)
    except:
        return jsonify({"error": "Priority harus angka integer"}), 400

    tasks.append({"task": task, "deadline": deadline, "priority": priority})
    sort_tasks()

    return jsonify({"message": "Tugas berhasil ditambahkan", "tasks": tasks}), 201

@app.route('/tasks', methods=['DELETE'])
def delete_all_tasks():
    tasks.clear()
    return jsonify({"message": "Semua tugas telah dihapus"}), 200

if __name__ == '__main__':
    app.run(debug=True)
