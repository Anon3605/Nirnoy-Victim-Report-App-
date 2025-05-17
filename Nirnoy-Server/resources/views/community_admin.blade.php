<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Community Admin</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f7fa;
      color: #333;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
      border-radius: 8px;
    }

    h1, h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 700;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 40px;
    }

    input[type="text"],
    input[type="url"] {
      padding: 10px 14px;
      font-size: 16px;
      border: 1.5px solid #ddd;
      border-radius: 6px;
      transition: border-color 0.3s ease;
    }

    input[type="text"]:focus,
    input[type="url"]:focus {
      border-color: #3498db;
      outline: none;
    }

    button[type="submit"] {
      background-color: #3498db;
      color: white;
      padding: 12px 18px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button[type="submit"]:hover {
      background-color: #2980b9;
    }

    ul {
      list-style: none;
      padding-left: 0;
      max-height: 300px;
      overflow-y: auto;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #eee;
    }

    li:last-child {
      border-bottom: none;
    }

    li strong {
      font-size: 18px;
      color: #2c3e50;
      word-break: break-word;
    }

    li form {
      margin: 0;
    }

    li button {
      background-color: #e74c3c;
      border: none;
      padding: 8px 14px;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }

    li button:hover {
      background-color: #c0392b;
    }
  </style>
</head>
<body>
  <h1>Add New Video</h1>
  <form method="POST" action="/admin/community">
    @csrf
    <input name="title" type="text" placeholder="Video Title" required />
    <input name="embed_utube_link" type="url" placeholder="https://youtube.com/embed/..." required />
    <button type="submit">Add Video</button>
  </form>

  <h2>Existing Videos</h2>
  <ul>
    @foreach ($videos as $video)
      <li>
        <strong>{{ $video->title }}</strong>
        <form method="POST" action="/admin/community/{{ $video->id }}">
          @csrf
          @method('DELETE')
          <button type="submit">Delete</button>
        </form>
      </li>
    @endforeach
  </ul>
</body>
</html>
