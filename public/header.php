<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://transparency-france.org/" target="_blank"><img src="./images/ti_fr_logo.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item iw-fr-logo">
        <a href="./">Integrity Watch France</a>
      </li>
      <li class="nav-item">
        <a href="./" class="nav-link" :class="{active: page == 'meps'}">Parlementaires en France</a>
      </li>
      <li class="nav-item">
        <a href="./lobbyists.php" class="nav-link" :class="{active: page == 'lobbyists'}">Lobbyistes</a>
      </li>
      <li class="nav-item">
        <a href="./activities.php" class="nav-link" :class="{active: page == 'activities'}">Activités de lobbying</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Versions nationales
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">France</a>
          <a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">United Kingdom</a>
          <a class="dropdown-item" href="https://integritywatch.cl/" target="_blank">Chile</a>
          <a class="dropdown-item" href="http://www.soldiepolitica.it/" target="_blank">Italy</a>
        </div>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href="./about" class="nav-link">A propos</a>
      </li>
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn info-btn" @click="showInfo = !showInfo">info</i>
      </li>
    </ul>
  </div>
</nav>