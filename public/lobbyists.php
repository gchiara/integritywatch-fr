<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch France | Lobbyistes</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.fr" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch France | Lobbyistes" />
    <meta property="og:description" content="IntegrityWatch France : un outil interactif inédit pour prévenir les conflits d’intérêts de nos élus et renforcer la transparence du lobbying en France." />
    <meta property="og:image" content="https://www.integritywatch.fr/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/lobbyists.css">
</head>
<body>
    <div id="app" class="tabB-page">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch France - Lobbyistes</h1>
                  <p><i>Quels sont les moyens consacrés au lobbying ? Quelle est la taille et le type des acteurs impliqués selon les secteurs d'activité ? Quelle part travaille pour des mandants ou en propre ?</i></p>
                  <p>Les lobbyistes ne doivent se déclarer à la Haute Autorité pour la Transparence de la Vie Publique (HATVP) que s'ils exercent une activité principale et régulière de lobbying, une limitation qui restreint le champ de déclaration. L'obligation de s'enregistrer et les données devant être déclarées répondent à des règles complexes pouvant biaiser la lecture, <a href="./about.php">En savoir plus...</a></p>
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_1">
              <chart-header :title="charts.activitiesNum.title" :info="charts.activitiesNum.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="activitiesnum_chart"></div>
            </div> 
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_2">
              <chart-header :title="charts.chiffreAffaire.title" :info="charts.chiffreAffaire.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="chiffreaffaire_chart"></div>
            </div> 
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_3">
              <chart-header :title="charts.montantDepense.title" :info="charts.montantDepense.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="montantdepense_chart"></div>
            </div> 
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_6b">
              <chart-header :title="charts.years.title" :info="charts.years.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="years_chart"></div>
            </div> 
          </div> 
          <!-- CHARTS - SECOND ROW -->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_5">
              <chart-header :title="charts.lobbyists.title" :info="charts.lobbyists.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="lobbyists_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_6">
              <chart-header :title="charts.clients.title" :info="charts.clients.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="clients_chart"></div>
            </div> 
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_4">
              <chart-header :title="charts.sectors.title" :info="charts.sectors.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="sectors_chart"></div>
            </div> 
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabB_7">
              <chart-header :title="charts.category.title" :info="charts.category.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="category_chart"></div>
            </div> 
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.mainTable.title" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nom de l’organisation</th>
                      <th class="header">Catégorie</th>
                      <th class="header">Nombre d'activités déclarées</th>
                      <th class="header">Nombre de personnes dédiées à la représentation d’intérêt</th>
                      <th class="header">Nombre de secteurs d'activité</th>
                      <th class="header">Nombre de clients ou mandants</th>
                      <th class="header">Nombre d’organisations d’appartenance</th>
                      <th class="header">Déclaration à jour ?</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="lobbyist-name" v-if="selectedElement.nomUsage">{{ selectedElement.nomUsage }}</div>
                <div class="lobbyist-name" v-else>{{ selectedElement.denomination }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line" v-if="selectedElement.categorieOrganisation"><span class="details-line-title">Catégorie : </span> {{ selectedElement.categorieOrganisation.label }}</div>
                    <div class="details-line" v-else><span class="details-line-title">Catégorie : </span> /</div>
                    <div class="details-line"><span class="details-line-title">Secteurs d'activité déclarés : </span>
                      <ul>
                        <li v-for="s in selectedElement.sectors">
                          {{ s }}
                        </li>
                      </ul>
                    </div>
                    <div class="details-line" v-if="selectedElement.latestPub"><span class="details-line-title">Nombre d’activités déclarés : </span> {{ selectedElement.latestPub.nombreActivite }}</div>
                    <div class="details-line" v-if="selectedElement.latestPub"><span class="details-line-title">Montant des dépenses : </span> {{ selectedElement.latestPub.montantDepense }}</div>
                    <div class="details-line" v-if="selectedElement.latestPub"><span class="details-line-title">Chiffre d’affaires : </span> {{ selectedElement.latestPub.chiffreAffaire }}</div>
                    <div class="details-line"><span class="details-line-title">Nombre d’employés : </span> {{ selectedElement.collabNum }}</div>
                    <div class="details-tables-buttons">
                      <button @click="showClientsTable = !showClientsTable">Organisations connectées</button>
                    </div>
                    <table class="tabB-clients-table" v-show="showClientsTable">
                      <thead>
                        <tr>
                          <th>Clients ou mandants</th>
                          <th>Organisations d’appartenance</th>
                          <th>Organisations qui déclarent cet organisme comme clients/mandats ou comme organisation d’appartenance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <ul>
                              <li v-for="c in selectedElement.clients">
                                {{ c.denomination }}
                              </li>
                            </ul>
                          </td>
                          <td>
                            <ul>
                              <li v-for="a in selectedElement.affiliations">
                                {{ a.denomination }}
                              </li>
                            </ul>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="details-line"><span class="details-line-title">Date de dernière mise à jour : </span> {{ selectedElement.dateDernierePublicationActivite }}</div>
                    <div class="details-line"><span class="details-line-title">Lien déclaration HATPV : </span> <a :href="'https://www.hatvp.fr/fiche-organisation/?organisation='+selectedElement.identifiantNational" target="_blank">https://www.hatvp.fr/fiche-organisation/?organisation={{ selectedElement.identifiantNational }}</a></div>
                     
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filtrer par pouvoir public, lobbyiste, sujet">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box activities-count">
              <div class="filter-count">0</div>parmi <strong class="total-count">0</strong> organisations (<span class="percentage-count"></span>)
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i></button>
        <div class="footer-buttons-right">
          <!-- <button><i class="material-icons">cloud_download</i></button> -->
          <button class="download-data-btn" @click="downloadDataset"><i class="material-icons">cloud_download</i></button>
          <button class="btn-twitter" @click="share('twitter')"><img src="./images/twitter.png" /></button>
          <button class="btn-fb" @click="share('facebook')"><img src="./images/facebook.png" /></button>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Veuillez patienter pendant que les données sont chargées...'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/topojson.v1.min.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/lobbyists.js"></script>

 
</body>
</html>