<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>About</title>
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/about.css">
</head>
<body>
    <?php include 'header.php' ?>

    <div id="app">    
      <div class="container">
        <div class="panel-group" id="accordion">
          <!-- BLOCK 1 -->
          <div class="panel panel-default">
            <div class="panel-heading">
              <h1 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">1. About</a>
              </h1>
            </div>
            <div id="collapse1" class="panel-collapse collapse in">
              <div class="panel-body">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque viverra posuere dolor id rutrum. Nulla eu convallis magna, vel luctus dolor. Proin ac nunc nec enim tempor sagittis eget et felis. Vivamus eget orci in massa sollicitudin auctor. Donec in arcu ac augue euismod cursus. Mauris venenatis nulla ac hendrerit posuere. Morbi eget aliquet est, non tincidunt lectus. Maecenas aliquam eros ut felis fermentum, sed congue tellus iaculis.</p>
                <div class="about-eu-funding">
                  <img class="logo" src="./images/flag_yellow_low.jpg" />
                  <p style="font-family: Arial">This online platform was funded by the European Union’s Internal Security Fund – Police</p>
                </div>
                <p>Website design and development:<br />
                <a href="http://www.chiaragirardelli.net">Chiara Girardelli</a><br /></p>
              </div>
            </div>
          </div>
          <!-- CONTACTS -->
          <div class="panel panel-default panel-static">
            <div class="panel-heading">
              <h2 class="panel-title">
                <a href="#">Contact Details</a>
              </h2>
            </div>
            <div id="contact" class="panel-collapse">
              <div class="panel-body">
              <p>Lorem ipsum sit dolor amet:</p>
              <p>
                <strong>Lorem Ipsum</strong><br />
                Adipiscit elur<br />
                +00 000000000<br />
                <a href="mailto:loremipsum@loremipsum.com">loremipsum@loremipsum.com</a>
              </p>
            </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <script src="static/about.js"></script>
</body>
</html>