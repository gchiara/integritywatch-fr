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
  page: 'meps',
  loader: true,
  showInfo: true,
  showShare: true,
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
      title: 'Nombre d’activités par sous-catégorie de responsables publics',
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
    mainTable: {
      chart: null,
      type: 'table',
      title: 'ACTIVITEES DE LOBBYING',
      info: 'test'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  colors: {
    colorSchemeCloud: [ "#4d9e9c", "#62aad9", "#3b95d0", "#42b983", "#449188", "#52c993", "#b7bebf", "#99b6c0" ],
    activities: {
      "0":"#ccc",
      "1":"#8ed3fb",
      "2 - 5":"#68add4",
      "6 - 10":"#4388ad",
      "> 10":"#1a6287"
    },
    default: ["#3b95d0"],
  },
  categories: {

  }
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
      charts[c].chart.size(charts[c].divId);
      charts[c].chart.redraw();
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
json('./data/c/agora_repertoire_opendata.json', (err, lobbyists) => {

  var activities = [];
  //Loop through data to aply fixes and calculations
  _.each(lobbyists.publications, function (d) {
    //Set up parameters that will be used in graphs and tables
    //String that will be used for search functionality
    d.searchstring = "";
    //Let's try to extract activities to their own object. This might have to be moved to a PHP script later.
    if(d.exercices && d.exercices.length > 0){
      //Save general info about organization for info panel
      var amount = "";
      var actNum = 0;
      var chiffre = "";
      _.each(d.exercices, function (ex) {
        if(ex.publicationCourante.montantDepense) {
          amount = amount + ex.publicationCourante.montantDepense + '<br />';
        }
        if(ex.publicationCourante.activites) {
          actNum += ex.publicationCourante.activites.length;
        }
        if(ex.publicationCourante.chiffreAffaire) {
          chiffre = chiffre + ex.publicationCourante.chiffreAffaire + '<br />';
        }
      });
      _.each(d.exercices, function (ex) {
        var periode = "N/A";
        if(ex.publicationCourante.dateDebut) {
          periode = ex.publicationCourante.dateDebut.split('-')[2];
        }
        if(ex.publicationCourante && ex.publicationCourante.activites) {
          _.each(ex.publicationCourante.activites, function (act) {
            //Add lobbyists info to activity and add activity to activities list
            //Get reponsablesPublics info, decisions concernees and actions menees
            act.repType = [];
            act.decisions = [];
            act.actions = [];
            act.observations = "Non";
            act.tiers = "Non";
            if(act.publicationCourante.actionsRepresentationInteret){
              _.each(act.publicationCourante.actionsRepresentationInteret, function (rep) {
                if(rep.reponsablesPublics) {
                  act.repType = act.repType.concat(rep.reponsablesPublics);
                }
                if(rep.decisionsConcernees) {
                  act.decisions = act.decisions.concat(rep.decisionsConcernees);
                }
                if(rep.actionsMenees) {
                  act.actions = act.actions.concat(rep.actionsMenees);
                }
                if(rep.observation) {
                  act.observations = "Oui";
                }
                if(rep.tiers) {
                  act.tiers = "Oui";
                }
              });
            }
            act.collab = 0;
            if(d.dirigeants){
              act.collab += d.dirigeants.length;
            }
            if(d.collaborateurs){
              act.collab += d.collaborateurs.length;
            }
            act.idNational = d.identifiantNational;
            act.actNum = actNum;
            act.amount = amount;
            act.chiffre = chiffre;
            act.periode = periode;
            act.orgName = d.denomination;
            act.org = d.nomUsage;
            act.catOrg = d.categorieOrganisation.label;
            act.searchstring = "";
            //Add activity to activities list
            activities.push(act);
          });
        }
      });
    }
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
      return d.repType;  
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
      .dimension(dimension)
      .group(group);
      /*
      .ordering(function(d) { return order.indexOf(d)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      });
      */
    chart.render();
  }

  //CHART 2
  var createTopRepsChart = function() {
    var chart = charts.topReps.chart;
    var dimension = ndx.dimension(function (d) {
        return d.repType;
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
      /*
      .colorCalculator(function(d, i) {
        var level = getPolicyLevel(d.key);
        return vuedata.colors.ecPolicy[level];
      })
      */
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

  //CHART 3
  var createTopOrgsChart = function() {
    var chart = charts.topOrgs.chart;
    var dimension = ndx.dimension(function (d) {
        return d.catOrg;
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
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      /*
      .colorCalculator(function(d, i) {
        var level = getPolicyLevel(d.key);
        return vuedata.colors.ecPolicy[level];
      })
      */
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
      return d.catOrg;  
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
      .dimension(dimension)
      .group(group);
      /*
      .ordering(function(d) { return order.indexOf(d)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      });
      */
    chart.render();
  }

  //CHART 5
  var createRepCatChart = function() {
    var chart = charts.repCat.chart;
    var dimension = ndx.dimension(function (d) {
        return d.repType;
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
    var width = recalcWidth(charts.repCat.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      /*
      .colorCalculator(function(d, i) {
        var level = getPolicyLevel(d.key);
        return vuedata.colors.ecPolicy[level];
      })
      */
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
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      /*
      .colorCalculator(function(d, i) {
        var level = getPolicyLevel(d.key);
        return vuedata.colors.ecPolicy[level];
      })
      */
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
      /*
      .colorCalculator(function(d, i) {
        var level = getPolicyLevel(d.key);
        return vuedata.colors.ecPolicy[level];
      })
      */
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
      .height(440)
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
      /*
      .colorCalculator(function(d, i) {
        var level = getPolicyLevel(d.key);
        return vuedata.colors.ecPolicy[level];
      })
      */
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

  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.publicationCourante.identifiantFiche;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "type":"date-eu",
          "data": function(d) {
            return d.publicationCourante.publicationDate;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.repType;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.publicationCourante.objet;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.org;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.catOrg;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.observations;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 8,
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
      "order": [[ 3, "desc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.mainTable.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedElement = data;
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
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

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
    RefreshTable();
  });

  //Custom counters
  /*
  var iniCountSetup = false;
  function drawCustomCounter() {
    var dim = ndx.dimension (function(d) {
      return d.name;
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        p.activities += +d.activities;
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        p.activities -= +d.activities;
        return p;
      },
      function(p,d) {  
        return {nb: 0, activities: 0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var activities = 0;
    var counter = dc.dataCount(".activities-count")
    .dimension(group)
    .group({value: function() {
      return group.all().filter(function(kv) {
        if (kv.value.nb > 0) {
          activities += +kv.value.activities;
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
      $(".activities-count").text(addcommas(Math.round(activities)));
      //Set up initial count
      if(iniCountSetup == false){
        $('.activities-counter .total-count').text(addcommas(Math.round(activities)));
        iniCountSetup = true;
      }
      activities=0;
    });
    counter.render();
  }
  drawCustomCounter();
  */
  

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
