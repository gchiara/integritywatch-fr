import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'activities',
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  organizations: {},
  charts: {
    repPublique: {
      title: 'Nombre d’activités par type de responsable publique ciblé',
      info: ''
    },
    topReps: {
      title: 'Top 10 des responsables publics visés',
      info: ''
    },
    topOrgs: {
      title: 'Top 10 des organisations par nombre d’activités',
      info: ''
    },
    orgsCats: {
      title: 'Nombre d’activités par catégories de lobbyiste',
      info: ''
    },
    repCat: {
      title: 'Lobbying ciblant le gouvernant : répartition des activités par portefeuilles ministériels',
      info: ''
    },
    objet: {
      title: 'Objet des activités',
      info: ''
    },
    lobbyCat: {
      title: 'Nombre d’activités par sous-catégorie de lobbyistes',
      info: ''
    },
    decisions: {
      title: 'Nombre d’activités par type de décisions publiques visées',
      info: ''
    },
    periode: {
      title: 'Nombre d’activités par période de déclaration:',
      info: ''
    },
    actions: {
      title: 'Nombre d’activités par type d’actions mis-en-oeuvre',
      info: ''
    },
    autoritiesAgencies: {
      title: 'Lobbying ciblant des autorités indépendantes : répartition des activités par AAI/API',
      info: ''
    },
    topDomains: {
      title: 'Top 10 des domaines d\'intervention',
      info: ''
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Activités de lobbying',
      info: 'test'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    colorSchemeCloud: [ "#4d9e9c", "#62aad9", "#3b95d0", "#42b983", "#449188", "#52c993", "#b7bebf", "#99b6c0" ],
    repType: {
      "Ministère": "#5da6d1",
      "Députés, sénateurs et agents parlementaires": "#3d96d1",
      "Premier Ministre": "#3583b8",
      "Présidence de la République": "#2e719e",
      "Autres": "#265f85",
      "Autorités et agences": "#1f4d6b",
    },
    orgType: {
      "Organisations professionnelles & syndicats": "#72e9b3",
      "Organisations commerciales": "#62d9a3",
      "Société civile": "#52c993",
      "Consultants": "#42b983",
      "Etablissement public à caractère économique": "#229983",
      "Autres organisations": "#1a8883",
      "Avocats": "#127983",
      "Organismes de recherche": "#026973"
    },
    default: ["#3d96d1"],
    default2: ["#229983"],
  },
  categories: {
    organizations: {
      "Société commerciale": "Organisations commerciales",
      "Société civile (autre que cabinet d’avocats)": "Société civile",
      "Cabinets d’avocats": "Avocats",
      "Cabinet d’avocats": "Avocats",
      "Avocat indépendant": "Avocats",
      "Cabinet de conseil": "Consultants",
      "Cabinet de conseils": "Consultants",
      "Consultant indépendant": "Consultants",
      "Organisation professionnelle": "Organisations professionnelles & syndicats",
      "Syndicat": "Organisations professionnelles & syndicats",
      "Chambre consulaire": "Etablissement public à caractère économique",
      "Association": "Société civile",
      "Fondation": "Société civile",
      "Organisme de recherche ou de réflexion": "Organismes de recherche",
      "Autre organisation non gouvernementale": "Société civile",
      "Autres organisations non gouvernementales": "Société civile",
      "Etablissement public exerçant une activité industrielle et commerciale": "Etablissement public à caractère économique",
      "Groupement d’intérêt public exerçant une activité industrielle et commerciale": "Etablissement public à caractère économique",
      "Autres organisations":	"Autres organisations"
    }
  },
  agencies: [
    "Agence française de lutte contre le dopage",
    "Autorité de contrôle des nuisances sonores aéroportuaires",
    "Autorité de régulation des communications électroniques et des postes",
    "Autorité de la concurrence",
    "Autorité de régulation de la distribution de la presse",
    "Autorité de régulation des activités ferroviaires et routières",
    "Autorité de régulation des jeux en ligne",
    "Autorité des marchés financiers",
    "Autorité de sûreté nucléaire",
    "Comité d indemnisation des victimes des essais nucléaires",
    "Commission d accès aux documents administratifs",
    "Commission du secret de la défense nationale",
    "Contrôleur général des lieux de privation de liberté",
    "Commission nationale des comptes de campagne et des financements politiques",
    "Commission nationale de contrôle des techniques de renseignement",
    "Commission nationale du débat public",
    "Commission nationale de l informatique et des libertés",
    "Commission de régulation de l énergie",
    "Conseil supérieur de l audiovisuel",
    "Défenseur des droits",
    "Haute Autorité de santé",
    "Haut Conseil de l évaluation de la recherche et de l enseignement supérieur",
    "Haut Conseil du commissariat aux comptes",
    "Haute Autorité pour la diffusion des œuvres et la protection des droits sur internet",
    "Haute Autorité pour la transparence de la vie publique",
    "Médiateur national de l énergie"
  ]
}



//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Share text here ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = 'https://integritywatch.fr';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  repPublique: {
    chart: dc.pieChart("#rep_publique_chart"),
    type: 'pie',
    divId: 'rep_publique_chart'
  },
  topReps: {
    chart: dc.rowChart("#topreps_chart"),
    type: 'row',
    divId: 'topreps_chart'
  },
  topOrgs: {
    chart: dc.rowChart("#toporgs_chart"),
    type: 'row',
    divId: 'toporgs_chart'
  },
  orgsCats: {
    chart: dc.pieChart("#orgscats_chart"),
    type: 'pie',
    divId: 'orgscats_chart'
  },
  repCat: {
    chart: dc.rowChart("#repcat_chart"),
    type: 'row',
    divId: 'repcat_chart'
  },
  objet: {
    chart: dc.wordCloud("#objet_chart"),
    type: 'cloud',
    divId: 'objet_chart'
  },
  lobbyCat: {
    chart: dc.rowChart("#lobbycat_chart"),
    type: 'row',
    divId: 'lobbycat_chart'
  },
  decisions: {
    chart: dc.rowChart("#decisions_chart"),
    type: 'row',
    divId: 'decisions_chart'
  },
  periode: {
    chart: dc.barChart("#periode_chart"),
    type: 'bar',
    divId: 'periode_chart'
  },
  actions: {
    chart: dc.rowChart("#actions_chart"),
    type: 'row',
    divId: 'actions_chart'
  },
  autoritiesAgencies: {
    chart: dc.rowChart("#autoritiesagencies_chart"),
    type: 'row',
    divId: 'autoritiesagencies_chart'
  },
  topDomains: {
    chart: dc.rowChart("#topdomains_chart"),
    type: 'row',
    divId: 'topdomains_chart'
  },
  mainTable: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function(divId) {
  //Replace element if with wordcloud column id
  var width = document.getElementById(divId).offsetWidth - vuedata.chartMargin*2;
  return [width, 550];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    if((c == 'topDomains' || c == 'autoritiesAgencies') && vuedata.showAllCharts == false){
      
    } else {
      var sizes = calcPieSize(charts[c].divId);
      var newWidth = recalcWidth(charts[c].divId);
      var charsLength = recalcCharsLength(newWidth);
      if(charts[c].type == 'map') {
        var newProjection = d3.geoMercator()
          .center([11,45]) //theorically, 50°7′2.23″N 9°14′51.97″E but this works
          .translate([newWidth - 50, 220])
          .scale(newWidth*3);
        charts[c].chart.width(newWidth);
        charts[c].chart.projection(newProjection);
        charts[c].chart.redraw();
      } else if(charts[c].type == 'row'){
        charts[c].chart.width(newWidth);
        charts[c].chart.label(function (d) {
          var thisKey = d.key;
          if(thisKey.indexOf('###') > -1){
            thisKey = thisKey.split('###')[0];
          }
          if(thisKey.length > charsLength){
            return thisKey.substring(0,charsLength) + '...';
          }
          return thisKey;
        })
        charts[c].chart.redraw();
      } else if(charts[c].type == 'bar'){
        charts[c].chart.width(newWidth);
        charts[c].chart.rescale();
        charts[c].chart.redraw();
      } else if(charts[c].type == 'pie') {
        charts[c].chart
          .width(sizes.width)
          .height(sizes.height)
          .cy(sizes.cy)
          .innerRadius(sizes.innerRadius)
          .radius(sizes.radius)
          .legend(dc.legend().x(0).y(sizes.legendY).gap(10));
        charts[c].chart.redraw();
      } else if(charts[c].type == 'cloud') {
        charts[c].chart.size([newWidth,550]);
        //.size([recalcWidth(charts.objet.divId),550])
        charts[c].chart.redraw();
      } 
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Clean strings
function cleanstring(str) {
	if(str) {
		return str.trim().toLowerCase();
	} else {
		return '';
	}
}
//Clean strings with special characters
function cleanstringSpecial(str) {
	if(str){
	var newStr = str.trim().toLowerCase();
	newStr = newStr.replace("é","e");
	newStr = newStr.replace("è","e");
	newStr = newStr.replace("ç","c");
	newStr = newStr.replace("-"," ");
	newStr = newStr.replace("ë","e");
	newStr = newStr.replace(".","");
	newStr = newStr.replace(/é/g , "e");
	newStr = newStr.replace(/è/g , "e");
	newStr = newStr.replace(/ç/g , "c");
	newStr = newStr.replace(/_/g , " ");
	newStr = newStr.replace(/ë/g , "e");
	newStr = newStr.replace(/\./g , "");
	newStr = newStr.replace("  "," ");
	return newStr;
	}
}

//Streamline reponsablesPublics
function streamlineRep(rp) {
  var cat1 = [];
  var cat2 = [];
  return '';
}

//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Load data and generate charts
//json('./data/c/agora_repertoire_opendata.json', (err, lobbyists) => {
  json('./data/c/activities.json', (err, activities) => {

  //console.log(repTypesList.sort());
  //$('body').html(repTypesList.sort().join('<br />'));
  _.each(activities, function (d) {
    d.searchstring = d.orgName + ' ' + d.publicationCourante.objet + ' ' + d.observationsText;

    d.repTypeClean = [];
    _.each(d.repType, function (r) {
      d.repTypeClean.push(r.replace('Membre du Gouvernement ou membre de cabinet ministériel - ',''));
    });

    //console.log(d.repTypeAgencies);
    //console.log(d.publicationCourante.domainesIntervention);
  });

  //Set dc main vars
  var ndx = crossfilter(activities);
  var searchDimension = ndx.dimension(function (d) {
      return d.searchstring.toLowerCase();
  });

  //CHART 1
  var createRepPubliqueChart = function() {
    var chart = charts.repPublique.chart;
    var dimension = ndx.dimension(function (d) {
      //return d.repType; 
      return d.repTypeStreamLined; 
    }, true);
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.repPublique.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .label(function (d){
        var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
        percent = percent*100;
        return percent.toFixed(1) + '%';
      })
      .dimension(dimension)
      .group(group)
      .colorCalculator(function(d, i) {
        return vuedata.colors.repType[d.key];
      });
    chart.render();
  }

  //CHART 2
  var createTopRepsChart = function() {
    var chart = charts.topReps.chart;
    var dimension = ndx.dimension(function (d) {
        return d.repTypeClean;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topReps.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key && d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //CHART 3
  var createTopOrgsChart = function() {
    var chart = charts.topOrgs.chart;
    var dimension = ndx.dimension(function (d) {
        //return d.catOrg;
        //return d.org;
        return d.orgName;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topOrgs.divId);
    var charsLength = recalcCharsLength(width);
    function getOrgType(org) {
      var entry =  _.find(activities, function (x) { return x.orgName == org });
      if(entry){
        return entry.catOrgStreamlined;
      }
      return "";
    }
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        var type = getOrgType(d.key);
        return vuedata.colors.orgType[type];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //CHART 4
  var createOrgsCatsChart = function() {
    var chart = charts.orgsCats.chart;
    var dimension = ndx.dimension(function (d) {
      return d.catOrgStreamlined;  
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.orgsCats.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .label(function (d){
        var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
        percent = percent*100;
        return percent.toFixed(1) + '%';
      })
      .dimension(dimension)
      .group(group)
      .colorCalculator(function(d, i) {
        return vuedata.colors.orgType[d.key];
      });
    chart.render();
  }

  //CHART 5
  var createRepCatChart = function() {
    var chart = charts.repCat.chart;
    var dimension = ndx.dimension(function (d) {
          return d.repTypeStreamLinedSub;  
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(40).filter(function(d) {
            return (d.value != 0 && d.key != "Autres: 'free text'" && d.key != "Premier Ministre" && d.key != "Présidence de la République" && d.key != "Autorités et agences" && d.key != "Députés, sénateurs et agents parlementaires");
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.repCat.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }
  
  //CHART 6
  var createObjetChart = function() {
    var chart = charts.objet.chart;
    var dimension = ndx.dimension(function(d) {
      return d.publicationCourante.objet || "";
    })
    var group   = dimension.group().reduceSum(function(d) { return 1; });
    chart
    .dimension(dimension)
    .group(group)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .maxWords(70)
    .timeInterval(10)
    .duration(200)
    .ordinalColors(vuedata.colors.colorSchemeCloud)
    .size([recalcWidth(charts.objet.divId),550])
    .font("Impact")
    .stopWords(/^(au|ou|un|une|que|aux)$/)
    .onClick(function(d){setword(d.key);})
    .textAccessor(function(d) {return d.publicationCourante.objet;});
    chart.size(recalcWidthWordcloud(charts.objet.divId));
    chart.render();
  }

  //CHART 7
  var createLobbyCatChart = function() {
    var chart = charts.lobbyCat.chart;
    var dimension = ndx.dimension(function (d) {
        return  d.catOrg;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(40).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.lobbyCat.divId);
    var charsLength = recalcCharsLength(width);
    function getOrgType(org) {
      var entry =  _.find(activities, function (x) { return x.catOrg == org });
      if(entry){
        return entry.catOrgStreamlined;
      }
      return "";
    }
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        var type = getOrgType(d.key);
        return vuedata.colors.orgType[type];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //CHART 8
  var createDecisionsChart = function() {
    var chart = charts.decisions.chart;
    var dimension = ndx.dimension(function (d) {
        return d.decisions;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(40).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.decisions.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //CHART 9
  var createPeriodeChart = function() {
    var chart = charts.periode.chart;
    var dimension = ndx.dimension(function (d) {
        return d.periode;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.periode.divId);
    chart
      .width(width)
      .height(500)
      .group(group)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 20})
      .x(d3.scaleBand().domain(["N/A", "2017", "2018", "2019"]))
      .xUnits(dc.units.ordinal)
      .gap(10)
      .elasticY(true)
      .ordinalColors(vuedata.colors.default)
    chart.render();
  }

  //CHART 10
  var createActionsChart = function() {
    var chart = charts.actions.chart;
    var dimension = ndx.dimension(function (d) {
        return d.actions;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(40).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.actions.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .colorCalculator(function(d, i) {
        return vuedata.colors.default2;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //autoritiesAgencies

  //CHART 11
  var createAutoritiesAgenciesChart = function() {
    var chart = charts.autoritiesAgencies.chart;
    var dimension = ndx.dimension(function (d) {
      return d.filteredRepsAgencies;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.autoritiesAgencies.divId);
    console.log(width);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .label(function (d) {
          if(d.key && d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //CHART 12
  var createTopDomainsChart = function() {
    var chart = charts.topDomains.chart;
    var dimension = ndx.dimension(function (d) {
      return d.publicationCourante.domainesIntervention;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDomains.divId);
    console.log(width);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .label(function (d) {
          if(d.key && d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .colorCalculator(function(d, i) {
        return vuedata.colors.default2;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "columnDefs": [
        {
          "searchable": false,
          "orderable": true,
          "targets": 0,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.publicationCourante.objet;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.org){
              return d.org;
            }
            return d.orgName;
          }
        },
        {
          "searchable": true,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.catOrg;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "type":"date-eu",
          "data": function(d) {
            //return d.publicationCourante.publicationDate;
            return d.dateDebut + ' / ' + d.dateFin;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.repType;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.publicationCourante && d.publicationCourante.domainesIntervention && d.publicationCourante.domainesIntervention.length > 0) {
              return d.publicationCourante.domainesIntervention.join(', ');
            }
            return "/";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.observations;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.tiers;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "desc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.mainTable.chart;
    /*
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
    */
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedElement = data;
      //console.log(vuedata.selectedElement);
      $('#detailsModal').modal();
    });
  }
  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.mainTable.chart.fnClearTable();
      charts.mainTable.chart.fnAddData(alldata);
      charts.mainTable.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Set word for wordcloud
  var setword = function(wd) {
    //console.log(charts.subject.chart);
    $("#search-input").val(wd);
    var s = wd.toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createRepPubliqueChart();
  createTopRepsChart();
  createTopOrgsChart();
  createOrgsCatsChart();
  createRepCatChart();
  createObjetChart();
  createLobbyCatChart();
  createDecisionsChart();
  createPeriodeChart();
  createActionsChart();
  createAutoritiesAgenciesChart();
  createTopDomainsChart();
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Toggle last charts functionality and fix for responsiveness
  vuedata.showAllCharts = false;
  $('#charts-toggle-btn').click(function(){
    if(vuedata.showAllCharts){
      resizeGraphs();
    }
  })

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  //Update datatables
  counter.on("renderlet.resetall", function(c) {
    calcCountPercentage();
    RefreshTable();
  });

  var calcCountPercentage = function() {
    var count = $('.activities-count .filter-count').html();
    var total = $('.activities-count .total-count').html();
    count = parseInt(count.replace(",", ""));
    total = parseInt(total.replace(",", ""));
    var percent = ((count/total) * 100).toFixed(1);
    $('.activities-count .percentage-count').html(percent + '%');
  }
  calcCountPercentage();

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
