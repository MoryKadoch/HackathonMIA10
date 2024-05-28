from flask import Flask, jsonify
import pyodbc

app = Flask(__name__)

conn_str = 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:mia10.database.windows.net,1433;Database=mia10_db;Uid=serverAd;Pwd=l@24j9Z,VR"D1x:0;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
conn = pyodbc.connect(conn_str)

@app.route('/')
def hello():
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM your_table')
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            'column1': row.column1,
            'column2': row.column2,
        })

    return jsonify(result)

if __name__ == '__main__':
    app.run()