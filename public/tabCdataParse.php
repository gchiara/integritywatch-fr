<?php

header("Content-Type: text/html; charset=utf-8");

//Categories for streamlining and streamlining functions
$organizations = array(
  "Société commerciale" => "Organisations commerciales",
  "Société civile (autre que cabinet d’avocats)" => "Société civile",
  "Cabinets d’avocats" => "Avocats",
  "Cabinet d’avocats" => "Avocats",
  "Avocat indépendant" => "Avocats",
  "Cabinet de conseil" => "Consultants",
  "Cabinet de conseils" => "Consultants",
  "Consultant indépendant" => "Consultants",
  "Organisation professionnelle" => "Organisations professionnelles & syndicats",
  "Syndicat" => "Organisations professionnelles & syndicats",
  "Chambre consulaire" => "Etablissement public à caractère économique",
  "Association" => "Société civile",
  "Fondation" => "Société civile",
  "Organisme de recherche ou de réflexion" => "Organismes de recherche",
  "Autre organisation non gouvernementale" => "Société civile",
  "Autres organisations non gouvernementales" => "Société civile",
  "Etablissement public exerçant une activité industrielle et commerciale" => "Etablissement public à caractère économique",
  "Groupement d’intérêt public exerçant une activité industrielle et commerciale" => "Etablissement public à caractère économique",
  "Autres organisations" => "Autres organisations"
);

$repPubCategories = array(
  "Premier ministre" => "Premier Ministre---Premier Ministre",
  "Affaires étrangères et développement international" => "Ministère---Ministère des affaires étrangères et développement international",
  "Environnement, énergie et mer" => "Ministère---Ministère de l'environnement, énergie et mer",
  "Education nationale, enseignement supérieur et recherche" => "Ministère---Ministère de l'éducation nationale, enseignement supérieur et recherche",
  "Economie et finances" => "Ministère---Ministère de l'économie et finances",
  "Affaires sociales et santé" => "Ministère---Ministère des affaires sociales et santé", 
  "Défense" => "Ministère---Ministère de la défense",
  "Justice" => "Ministère---Ministère de la Justics",
  "Aménagement du territoire, ruralité et collectivités territoriales" => "Ministère---Ministère de l'aménagement du territoire, ruralité et collectivités territoriales", 
  "Travail, emploi, formation professionnelle et dialogue social" => "Ministère---Ministère du travail, emploi, formation professionnelle et dialogue social", 
  "Intérieur" => "Ministère---Ministère de l'intérieur", 
  "Agriculture, agroalimentaire et forêt" => "Ministère---Ministère de l'agriculture, agroalimentaire et forêt", 
  "Logement" => "Ministère---Ministère du logement",
  "Culture et communication" => "Ministère---Ministère de la culture et communication",
  "Famille, enfance et droits des femmes" => "Ministère---Ministère de la famille, de l'enfance et des droits des femmes", 
  "Fonction publique" => "Ministère---Ministère de la fonction publique", 
  "Ville, jeunesse et sport" => "Ministère---Ministère de la ville, jeunesse et sport", 
  "Outre-mer" => "Ministère---Ministère de l'outre-mer",
  "Autres : à préciser" => "Autres---Autres: 'free text'",
  "Agence française de lutte contre le dopage" => "Autorités et agences---Autorités et agences",
  "Autorité de contrôle des nuisances sonores aéroportuaires" => "Autorités et agences---Autorités et agences",
  "Autorité de régulation des communications électroniques et des postes" => "Autorités et agences---Autorités et agences",
  "Autorité de la concurrence" => "Autorités et agences---Autorités et agences",
  "Autorité de régulation de la distribution de la presse" => "Autorités et agences---Autorités et agences",
  "Autorité de régulation des activités ferroviaires et routières" => "Autorités et agences---Autorités et agences",
  "Autorité de régulation des jeux en ligne" => "Autorités et agences---Autorités et agences",
  "Autorité des marchés financiers" => "Autorités et agences---Autorités et agences",
  "Autorité de sûreté nucléaire" => "Autorités et agences---Autorités et agences",
  "Comité d indemnisation des victimes des essais nucléaires" => "Autorités et agences---Autorités et agences",
  "Commission d accès aux documents administratifs" => "Autorités et agences---Autorités et agences",
  "Commission du secret de la défense nationale" => "Autorités et agences---Autorités et agences",
  "Contrôleur général des lieux de privation de liberté" => "Autorités et agences---Autorités et agences",
  "Commission nationale des comptes de campagne et des financements politiques" => "Autorités et agences---Autorités et agences",
  "Commission nationale de contrôle des techniques de renseignement" => "Autorités et agences---Autorités et agences",
  "Commission nationale du débat public" => "Autorités et agences---Autorités et agences",
  "Commission nationale de l informatique et des libertés" => "Autorités et agences---Autorités et agences",
  "Commission de régulation de l énergie" => "Autorités et agences---Autorités et agences",
  "Conseil supérieur de l audiovisuel" => "Autorités et agences---Autorités et agences",
  "Défenseur des droits" => "Autorités et agences---Autorités et agences",
  "Haute Autorité de santé" => "Autorités et agences---Autorités et agences",
  "Haut Conseil de l évaluation de la recherche et de l enseignement supérieur" => "Autorités et agences---Autorités et agences",
  "Haut Conseil du commissariat aux comptes" => "Autorités et agences---Autorités et agences",
  "Haute Autorité pour la diffusion des œuvres et la protection des droits sur internet" => "Autorités et agences---Autorités et agences",
  "Haute Autorité pour la transparence de la vie publique" => "Autorités et agences---Autorités et agences",
  "Médiateur national de l énergie" => "Autorités et agences---Autorités et agences",
  "Député ; sénateur ; collaborateur parlementaire ou agents des services des assemblées parlementaires" => "Députés, sénateurs et agents parlementaires---Députés, sénateurs et agents parlementaires",
  "Collaborateur du Président de la République" => "Présidence de la République---Présidence de la République",
  "Titulaire d un emploi à la décision du Gouvernement" => "Autres---Titulaire d'un emploi à la décision du gourvernement"
);

$repPubAgencies = array(
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
);


function streamlineRepCategory($repString,$type) {
  global $repPubCategories;
  $streamlinedReps = [];
  //Note for later: add code to remove initial part of string if it conflicts with some matches
  //Loop and add streamlined categories
  foreach ($repPubCategories as $key => $value) {
    if(stripos($repString, $key) !== false) {
      $result = explode("---", $value);
      if($type == 'cat'){
        array_push($streamlinedReps, $result[0]);
      } else if($type == 'subcat') {
        array_push($streamlinedReps, $result[1]);
      }
    }
  }
  return $streamlinedReps;
}

function filterRepAgencies($repString) {
  global $repPubAgencies;
  $filteredReps = [];
  foreach ($repPubAgencies as $value) {
    if(stripos($repString, $value) !== false) {
      array_push($filteredReps, $value);
    }
  }
  return $filteredReps;
}



//Load dataset
$activities = [];
$file = file_get_contents("./data/c/agora_repertoire_opendata.json");
$data = json_decode($file, true);
$publications = $data['publications'];

//Loop and extract activities to their own object.
foreach ($publications as $key => $value) {
   
  $exercises = $value['exercices'];
  if($exercises && sizeof($exercises) > 0) {
    $amount = "";
    $actNum = 0;
    $chiffre = "";

    foreach ($exercises as $ex){ 
      if($ex['publicationCourante']['montantDepense']) {
        $amount = $amount.$ex['publicationCourante']['montantDepense'].' ('.$ex['publicationCourante']['dateDebut'].' / '.$ex['publicationCourante']['dateFin'].')'.'<br />';
      }
      if($ex['publicationCourante']['activites']) {
        $actNum = sizeof($ex['publicationCourante']['activites']);
      }
      if($ex['publicationCourante']['chiffreAffaire']) {
        $chiffre = $chiffre.$ex['publicationCourante']['chiffreAffaire'].' ('.$ex['publicationCourante']['dateDebut'].' / '.$ex['publicationCourante']['dateFin'].')'.'<br />';
      }
    } 

    foreach ($exercises as $ex) { 
      $periode = "N/A";
      if($ex['publicationCourante']['dateDebut']) {
        $periodeArray = explode("-", $ex['publicationCourante']['dateDebut']);
        $periode = $periodeArray[2];
      }
      //Loop through activities
      if($ex['publicationCourante'] && $ex['publicationCourante']['activites']) {
        foreach ($ex['publicationCourante']['activites'] as $act) { 
          //Add lobbyists info to activity and add activity to activities list
          //Get reponsablesPublics info, decisions concernees and actions menees
          $act['repType'] = [];
          $act['repTypeStreamLined'] = [];
          $act['repTypeStreamLinedSub'] = [];
          $act['filteredRepsAgencies'] = [];
          $act['decisions'] = [];
          $act['actions'] = [];
          $act['observations'] = "Non";
          $act['observationsText'] = "";
          $act['tiers'] = "Non";
          if($act['publicationCourante']['actionsRepresentationInteret']) {
            foreach ($act['publicationCourante']['actionsRepresentationInteret'] as $rep) { 
              if($rep['reponsablesPublics']) {
                $act['repType'] = array_merge($act['repType'], $rep['reponsablesPublics']);
                //Parse each string in reponsablesPublics, turning them into an array of streamlined categories, then concatenate
                foreach ($rep['reponsablesPublics'] as $repPub) {
                  $streamlinedReps = streamlineRepCategory($repPub,'cat');
                  $streamlinedRepsSub = streamlineRepCategory($repPub,'subcat');
                  $filteredRepsAgencies = filterRepAgencies($repPub);
                  $act['repTypeStreamLined'] = array_merge($act['repTypeStreamLined'], $streamlinedReps);
                  $act['repTypeStreamLinedSub'] = array_merge($act['repTypeStreamLinedSub'], $streamlinedRepsSub);
                  $act['filteredRepsAgencies'] = array_merge($act['filteredRepsAgencies'], $filteredRepsAgencies);
                }
                //print_r($act['repTypeStreamLinedSub']);
              }
              if($rep['decisionsConcernees']) {
                $act['decisions'] = array_merge($act['decisions'], $rep['decisionsConcernees']);
              }
              if($rep['actionsMenees']) {
                $act['actions'] = array_merge($act['actions'], $rep['actionsMenees']);
              }
              if($rep['observation']) {
                $act['observations'] = "Oui";
                $act['observationsText'] = $rep['observation'].'<br />'.$act['observationsText'];
              }
              $act['tiersList'] = [];
              if($rep['tiers']) {
                $act['tiersList'] = $rep['tiers'];
                $act['tiers'] = "Oui";
              }
            }
          }
          $act['collab'] = 0;
          if($value['dirigeants']) {
            $act['collab'] += sizeof($value['dirigeants']);
          }
          if($value['collaborateurs']) {
            $act['collab'] += sizeof($value['collaborateurs']);
          }
          $act['dateDebut'] = $ex['publicationCourante']['dateDebut'];
          $act['dateFin'] = $ex['publicationCourante']['dateFin'];
          $act['idNational'] = $value['identifiantNational'];
          $act['actNum'] = $actNum;
          $act['amount'] = $amount;
          $act['chiffre'] = $chiffre;
          $act['periode'] = $periode;
          $act['orgName'] = $value['denomination'];
          $act['org'] = $value['nomUsage'];
          $act['catOrg'] = $value['categorieOrganisation']['label'];
          $act['catOrgStreamlined'] = $organizations[$act['catOrg']];
          if($act['catOrgStreamlined'] == null){
            $act['catOrgStreamlined'] = $act['catOrg'];
          }
          $act['searchstring'] = "";
          //Add activity to activities list
          array_push($activities, $act);
        }
      }
    }
  } 
}
echo sizeof($activities);
//Save new dataset
file_put_contents('./data/c/activities.json', json_encode($activities, JSON_UNESCAPED_UNICODE));
echo 'Done';

?>