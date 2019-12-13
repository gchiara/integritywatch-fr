<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Parlementaires en France</title>
    <!-- Add twitter and og meta here -->
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/activities.css">
</head>
<body>
    <div id="app" class="tabC-page">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch France - Activités de lobbying</h1>
                  <p>Integrity Watch France est une base de données interactive sur le lobbying qui offre un aperçu unique des activités de lobbying entreprises en France par les organisations enregis-trés sur le registre des représentants d’intérêts de la Haute-Autorité pour la transparence dans la vie publique (HATVP).</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - LEFT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 subrow-title-container">
                <div class="subrow-title">POUVOIRS PUBLICS</div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabC_1">
                  <chart-header :title="charts.repPublique.title" :info="charts.repPublique.info" :customclass="'smaller'" ></chart-header>
                  <div class="chart-inner" id="rep_publique_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabC_2">
                  <chart-header :title="charts.topReps.title" :info="charts.topReps.info" :customclass="'smaller'" ></chart-header>
                  <div class="chart-inner" id="topreps_chart"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - RIGHT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 subrow-title-container subrow-title-container-right">
                <div class="subrow-title subrow-title-right">LOBBYISTES</div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabC_3">
                  <chart-header :title="charts.topOrgs.title" :info="charts.topOrgs.info" :customclass="'smaller'" ></chart-header>
                  <div class="chart-inner" id="toporgs_chart"></div>
                </div> 
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tabC_4">
                  <chart-header :title="charts.topOrgs.title" :info="charts.topOrgs.info" :customclass="'smaller'" ></chart-header>
                  <div class="chart-inner" id="orgscats_chart"></div>
                </div> 
              </div>
            </div>
          </div>
          <!-- CHARTS - SECOND ROW -->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabC_5">
              <chart-header :title="charts.repCat.title" :info="charts.repCat.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="repcat_chart"></div>
            </div> 
          </div>
          <div class="col-md-6 chart-col" id="wordcloud_chart_col">
            <div class="boxed-container chart-container tabC_6">
              <chart-header :title="charts.objet.title" :info="charts.objet.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="objet_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tabC_5">
              <chart-header :title="charts.lobbyCat.title" :info="charts.lobbyCat.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="lobbycat_chart"></div>
            </div> 
          </div>
          <!-- CHARTS - THIRD ROW -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tabC_8">
              <chart-header :title="charts.decisions.title" :info="charts.decisions.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="decisions_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col" id="wordcloud_chart_col">
           <div class="boxed-container chart-container tabC_9">
              <chart-header :title="charts.periode.title" :info="charts.periode.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="periode_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tabC_10">
              <chart-header :title="charts.actions.title" :info="charts.actions.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="actions_chart"></div>
            </div>
          </div>
          <!-- TOGGLE BUTTONS FOR 4TH ROW -->
          <div class="col-md-12 toggle-btn-container">
            <button class="toggle-btn" id="charts-toggle-btn" @click="showAllCharts = !showAllCharts">Autres graphs</button>
          </div>
          <!-- CHARTS - FOURTH ROW - CAN BE TOGGLED -->
          <div class="col-md-6 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tabC_11">
              <chart-header :title="charts.autoritiesAgencies.title" :info="charts.autoritiesAgencies.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="autoritiesagencies_chart"></div>
            </div>
          </div>
          <div class="col-md-6 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tabC_12">
              <chart-header :title="charts.topDomains.title" :info="charts.topDomains.info" :customclass="'smaller'" ></chart-header>
              <div class="chart-inner" id="topdomains_chart"></div>
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
                      <th class="header">Objet</th>
                      <th class="header">Nom de l’organisation</th>
                      <th class="header">Catégorie(s)</th> 
                      <th class="header">Période de déclaration</th>
                      <th class="header">Responsable (s) public visé</th> 
                      <th class="header">Domaines d'intervention</th>
                      <th class="header">Case facultative rem-plie ?</th> 
                      <th class="header">Activité effectué pour tiers?</th> 
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
                
                <div class="date" v-if="selectedElement.publicationCourante">{{ selectedElement.publicationCourante.identifiantFiche }} - {{ selectedElement.publicationCourante.publicationDate }}</div>
                <div class="subject" v-if="selectedElement.publicationCourante">Sujet: {{ selectedElement.publicationCourante.objet }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-6 details-left">
                    <div class="details-title details-title-left">POUVOIRS PUBLICS</div>
                    <div class="details-line"><span class="details-line-title">Responsables publics visé (s):</span> 
                      <span v-if="selectedElement.repType && selectedElement.repType.length > 0">{{ selectedElement.repType.join(', ') }}</span>
                      <span v-else> / </span>
                    </div>
                    <div class="details-line"><span class="details-line-title">Type de décisions publiques:</span>
                      <span v-if="selectedElement.decisions && selectedElement.decisions.length > 0">{{ selectedElement.decisions.join(', ') }}</span>
                      <span v-else> / </span>
                    </div>
                    <div class="details-line"><span class="details-line-title">Domaines d'intervention field:</span>
                      <span v-if="selectedElement.publicationCourante && selectedElement.publicationCourante.domainesIntervention && selectedElement.publicationCourante.domainesIntervention.length > 0">{{ selectedElement.publicationCourante.domainesIntervention.join(', ') }}</span>
                      <span v-else> / </span>
                    </div>
                  </div>
                  <div class="col-md-6 details-right">
                    <div class="details-title details-title-right">LOBBYISTE</div>
                    <div class="details-line"><span class="details-line-title">Nom de l’organisation:</span> {{ selectedElement.orgName }}</div>
                    <div class="details-line"><span class="details-line-title">Categorie:</span> {{ selectedElement.catOrg }}</div>
                    <div class="details-line"><span class="details-line-title">Nombre d’activités déclarés:</span> {{ selectedElement.actNum }}</div>
                    <div class="details-line"><span class="details-line-title">Montant des dépenses:</span><br /><span v-html="selectedElement.amount"></span></div>
                    <div class="details-line"><span class="details-line-title">Chiffre d’affaires:</span><br /><span v-html="selectedElement.chiffre"></span></div>
                    <div class="details-line"><span class="details-line-title">Nombre d’employés:</span> {{ selectedElement.collab }}</div>
                    <div class="details-line"><span class="details-line-title">Observations sur l'activité:</span> <span v-html="selectedElement.observationsText"></span></div>
                    <div class="details-line"><span class="details-line-title">Lien déclaration HATVP:</span> <a :href="'https://www.hatvp.fr/fiche-organisation/?organisation=' + selectedElement.idNational">https://www.hatvp.fr/fiche-organisation/?organisation={{ selectedElement.idNational }}</a></div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-tables-buttons">
                      <button @click="modalShowTable = 'a'" :class="{ active: modalShowTable == 'a' }">Action de lobbying effectuées</button>
                      <button @click="modalShowTable = 'b'" v-if="selectedElement.publicationCourante" :class="{ active: modalShowTable == 'b' }">Domaines d’intervention</button>
                      <button @click="modalShowTable = 'c'" :class="{ active: modalShowTable == 'c' }">Intérêts représentés</button>
                    </div>
                    <ul class="modal-list" v-show="modalShowTable == 'a'">
                      <li v-for="act in selectedElement.actions">{{ act }}</li>
                    </ul>
                    <ul class="modal-list" v-if="selectedElement.publicationCourante" v-show="modalShowTable == 'b'">
                      <li v-for="domains in selectedElement.publicationCourante.domainesIntervention">{{ domains }}</li>
                    </ul>
                    <ul class="modal-list" v-show="modalShowTable == 'c'">
                      <li v-for="tiers in selectedElement.tiersList">{{ tiers }}</li>
                    </ul>
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
              <div class="filter-count">0</div>parmi <strong class="total-count">0</strong> activités (<span class="percentage-count"></span>)
            </div>
            <!--
            <div class="count-box activities-counter">
              <div class="filter-count activities-count">0</div>parmi <strong class="total-count">0</strong> activités annexes conservées
            </div>
            -->
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i></button>
        <div class="footer-buttons-right">
          <!-- <button><i class="material-icons">cloud_download</i></button> -->
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

    <script src="static/activities.js"></script>

 
</body>
</html>