<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch France | Responsables publics</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.fr" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch France" />
    <meta property="og:description" content="IntegrityWatch France : un outil interactif inédit pour prévenir les conflits d’intérêts de nos élus et renforcer la transparence du lobbying en France." />
    <meta property="og:image" content="https://www.integritywatch.fr/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/meps.css">
</head>
<body>
    <div id="app" class="tabA-page">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Responsables publics</h1>
                  <p><i>Quelles sont les activités annexes de vos responsables publics, parlementaires ou membres du gouvernement, dans un département, un parti politique ou selon leur mandat ? Lesquels n'ont pas mis à jour leur déclaration depuis leur prise de fonction ? Combien d'activités annexes sont conservées ?</i></p>
                  <p>Simple d’utilisation, il suffit de cliquer sur les éléments des infographies pour filtrer, trier et produire les statistiques qui vous intéressent.</p>
                  <a href="./about.php?section=1">En savoir plus...</a></p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - LEFT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 chart-col">
                <div class="boxed-container chart-container tabA_1">
                  <chart-header :title="charts.map.title" :info="charts.map.info" ></chart-header>
                  <div class="map-buttons">
                    <button id="iledefrance">Ile de France</button>
                    <button id="franceterritories">DOM-TOM</button>
                  </div>
                  <div class="chart-inner" id="map_chart"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - RIGHT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabA_2">
                  <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
                  <div class="chart-inner" id="party_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabA_3">
                  <chart-header :title="charts.activities.title" :info="charts.activities.info" ></chart-header>
                  <div class="chart-inner" id="activities_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabA_4">
                  <chart-header :title="charts.mandate.title" :info="charts.mandate.info" ></chart-header>
                  <div class="chart-inner" id="mandate_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabA_5">
                  <chart-header :title="charts.gender.title" :info="charts.gender.info" ></chart-header>
                  <div class="chart-inner" id="gender_chart"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- TOGGLE BUTTONS FOR 4TH ROW -->
          <div class="col-md-12 toggle-btn-container">
            <button class="toggle-btn" id="charts-toggle-btn" @click="showAllCharts = !showAllCharts">Voir d'autres graphiques</button>
          </div>
          <!-- CHARTS - FOURTH ROW - CAN BE TOGGLED -->
          <div class="col-md-6 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tabA_6">
              <chart-header :title="charts.declarationsNumber.title" :info="charts.declarationsNumber.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="declarationsnumber_chart"></div>
            </div>
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.mainTable.title" ></chart-header>
              <div class="table-info-bar">
                <a href="./about.php?section=14">Que signifient ces données et comment les interpréter ?</a>
              </div>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Nom</th> 
                      <th class="header">Département</th>
                      <th class="header">Fonction</th>
                      <th class="header table-info-cell">Parti politique de rattachement <button class="table-info-btn" data-container="body" data-toggle="popover" data-html="true" data-placement="bottom" data-content="Données du parlement au 3/07/2020">i</button></th>
                      <th class="header table-info-cell">Groupe parlementaire de rattachement <button class="table-info-btn" data-container="body" data-toggle="popover" data-html="true" data-placement="bottom" data-content="Données du parlement au 3/07/2020">i</button></th>
                      <th class="header table-info-cell">Activités annexes conservées <button class="table-info-btn" data-container="body" data-toggle="popover" data-html="true" data-placement="bottom" data-content="Les mentions &quot;conservée&quot; déclarées par les responsables publics ne sont pas systématiquement mises à jour, les activités abandonnées apparaissent donc parfois comme conservées alors qu'elles sont terminées.">i</button></th>
                      <th class="header">Détention de participations financières</th>
                      <th class="header table-info-cell">Activités annexes des collaborateurs <button class="table-info-btn" data-container="body" data-toggle="popover" data-html="true" data-placement="bottom" data-content="Attention, de nombreux responsables publics indiquent erronément la nature de l'activité de leurs collaborateurs au lieu de simplement déclarer s'ils ont des activités annexes ou non, ce qui peut fausser la lecture.">i</button></th>	
                      <th class="header">Nombre de déclarations déposées</th>
                      <th class="header">Date de dépôt de la dernière déclaration</th>
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
                <div class="name">{{ selectedElement.name }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-8">
                    <div class="details-line"><span class="details-line-title">Mandat :</span> {{ selectedElement.mandat }}</div>
                    <div class="details-line" v-if="selectedElement.departement"><span class="details-line-title">Département :</span> {{ selectedElement.departement }} ({{ selectedElement.departement_n }})</div>
                    <div class="details-line" v-else><span class="details-line-title">Département :</span> {{ selectedElement.departement_n }}</div>
                    <div class="details-line" v-if="selectedElement.convertedFromCSV"><span class="details-line-title">Activités annexes conservées :</span> Pas de données open data disponibles</div>
                    <div class="details-line" v-else><span class="details-line-title">Activités annexes conservées :</span> {{ selectedElement.activities }}</div>
                    <div class="details-line"><span class="details-line-title">Déclaration originale :</span> <a :href="selectedElement.hatvp" target="_blank">Profil sur le site de la Haute Autorité pour la Transparence de la Vie Publique (HATVP)</a></div>
                  </div>
                  <div class="col-md-4">
                    <img :src="selectedElement.photoUrl" />
                  </div>
                  <div class="col-md-12">
                    <!-- Divider -->
                    <div class="modal-divider"></div>
                    <!-- Info table 1 -->
                    <div class="modal-table-title">ACTIVITÉS PROFESSIONNELLES RÉMUNÉRÉES EXERCEES À LA DATE DE L’ÉLECTION OU ANTERIEURES (5 ANS)</div>
                    <table class="modal-table" v-if="selectedElement.activProfCinqDerniere && selectedElement.activProfCinqDerniere.length > 0">
                      <thead><tr><th>Description</th><th>Employeur</th><th>Durée</th><th>Activité Conservée</th><th>Revenus</th></tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.activProfCinqDerniere"><td>{{ el.description }}</td><td>{{ el.employeur }}</td><td>De {{ el.dateDebut }} à {{ el.dateFin }}</td><td>{{ boolToX(el.conservee) }}</td><td v-html="revenusList(el.remuneration)"></td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
                    <!-- Info table 2 -->
                    <div class="modal-table-title">ACTIVITÉS DE CONSULTANT EXERCEE À LA DATE DE L’ÉLECTION OU ANTERIEURES (5 ANS)</div>
                    <table class="modal-table" v-if="selectedElement.activConsultant && selectedElement.activConsultant.length > 0">
                      <thead><tr><th>Description</th><th>Employeur</th><th>Durée</th><th>Activité Conservée</th><th>Revenus</th></tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.activConsultant"><td>{{ el.description }}</td><td>{{ el.employeur }}</td><td>De {{ el.dateDebut }} à {{ el.dateFin }}</td><td>{{ boolToX(el.conservee) }}</td><td v-html="revenusList(el.remuneration)"></td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
                    <!-- Info table 3 -->
                    <div class="modal-table-title">ORGANES DIRIGEANTS (PUBLIC OU PRIVÉ)</div>
                    <table class="modal-table" v-if="selectedElement.participationDirigeant && selectedElement.participationDirigeant.length > 0">
                      <thead><tr><th>Activité</th><th>Organisme</th><th>Durée</th><th>Activité Conservée</th><th>Revenus</th></tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.participationDirigeant"><td>{{ el.activite }}</td><td>{{ el.nomSociete }}</td><td>De {{ el.dateDebut }} à {{ el.dateFin }}</td><td>{{ boolToX(el.conservee) }}</td><td v-html="revenusList(el.remuneration)"></td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
                    <!-- Info table 4 -->
                    <div class="modal-table-title">PARTICIPATIONS FINANCIÈRES</div>
                    <table class="modal-table" v-if="selectedElement.participationFinanciere && selectedElement.participationFinanciere.length > 0">
                      <thead><tr><th>Société</th><th>Evaluation</th><th>Nombre de parts</th><th>Pourcentage du capital détenu</th><th>Revenus (année précédente)</th></tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.participationFinanciere"><td>{{ el.nomSociete }}</td><td>{{ el.evaluation }} €</td><td>De {{ el.nombreParts }}</td><td>{{ el.capitalDetenu }}%</td><td>{{ el.remuneration }}</td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
                    <!-- Info table 5 -->
                    <div class="modal-table-title">ACTIVITÉS DU CONJOINT</div>
                    <table class="modal-table" v-if="selectedElement.activProfConjoint && selectedElement.activProfConjoint.length > 0">
                      <thead><tr><th>Activité</th><th>Employeur</th></tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.activProfConjoint"><td>{{ el.activiteProf }}</td><td>{{ el.employeurConjoint }}</td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
                    <!-- Info table 6 -->
                    <div class="modal-table-title">ACTIVITÉS BÉNÉVOLES</div>
                    <table class="modal-table" v-if="selectedElement.fonctionBenevole && selectedElement.fonctionBenevole.length > 0">
                      <thead><tr><th>Activité</th><th>Organisme</th><th>Activité Conservée</tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.fonctionBenevole"><td>{{ el.descriptionActivite }}</td><td>{{ el.nomStructure }}</td><td>{{ boolToX(el.conservee) }}</td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
                    <!-- Info table 7 -->
                    <div class="modal-table-title">MANDAT</div>
                    <table class="modal-table" v-if="selectedElement.mandatElectif && selectedElement.mandatElectif.length > 0">
                      <thead><tr><th>Mandat</th><th>Durée</th><th>Activité Conservée</th><th>Revenus</th></tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.mandatElectif"><td>{{ el.descriptionMandat }}</td><td>De {{ el.dateDebut }} à {{ el.dateFin }}</td><td>{{ boolToX(el.conservee) }}</td><td v-html="revenusList(el.remuneration)"></td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
                    <!-- Info table 8 -->
                    <div class="modal-table-title">COLLABORATEURS ET LEURS ACTIVITÉS</div>
                    <table class="modal-table" v-if="selectedElement.activCollaborateurs && selectedElement.activCollaborateurs.length > 0">
                      <thead><tr><th>Nom</th><th>Activité</th><th>Employeur</th></tr></thead>
                      <tbody>
                        <tr v-for="el in selectedElement.activCollaborateurs"><td>{{ el.nom }}</td><td>{{ el.descriptionActivite }}</td><td>{{ el.employeur }}</td></tr>
                      </tbody>
                    </table>
                    <div class="modal-table-else" v-else>/</div>
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
              <input type="text" id="search-input" placeholder="Nom du Parlementaire ou du Département">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>parmi <strong class="total-count">0</strong> parlementaires
            </div>
            <div class="count-box activities-counter">
              <div class="filter-count activities-count">0</div>parmi <strong class="total-count">0</strong> activités annexes conservées
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

    <script src="static/meps.js"></script>

 
</body>
</html>