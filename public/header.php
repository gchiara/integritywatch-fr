<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://transparency.eu/" target="_blank"><img src="./images/ti_eu_logo.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a href="./" class="nav-link" :class="{active: page == 'meps'}">Parlementaires en France</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          National versions
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">France</a>
          <a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">United Kingdom</a>
          <a class="dropdown-item" href="https://integritywatch.cl/" target="_blank">Chile</a>
        </div>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href="./about" class="nav-link">About</a>
      </li>
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn info-btn" @click="showInfo = !showInfo">info</i>
      </li>
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn share-btn" @click="showShare = !showShare">share</i>
      </li>
    </ul>
  </div>
</nav>