import { clinicalMessages } from './clinical-messages.ts'
// Values are Spanish, French, German. English source strings are stable translation keys.
const baseMessages: Record<string, [string, string, string]> = {
  "Settings": [
    "Ajustes",
    "Paramètres",
    "Einstellungen"
  ],
  "Language": [
    "Idioma",
    "Langue",
    "Sprache"
  ],
  "Color palette": [
    "Paleta de colores",
    "Palette de couleurs",
    "Farbpalette"
  ],
  "Neutral": [
    "Neutro",
    "Neutre",
    "Neutral"
  ],
  "Blue": [
    "Azul",
    "Bleu",
    "Blau"
  ],
  "Violet": [
    "Violeta",
    "Violet",
    "Violett"
  ],
  "Rose": [
    "Rosa",
    "Rose",
    "Rosa"
  ],
  "Orange": [
    "Naranja",
    "Orange",
    "Orange"
  ],
  "Body explorer": [
    "Explorador del cuerpo",
    "Explorateur du corps",
    "Körperexplorer"
  ],
  "Select a region to explore cancer types, subtypes, and disease-specific staging.": [
    "Selecciona una región para explorar los tipos y subtipos de cáncer y su clasificación específica.",
    "Sélectionnez une région pour explorer les types et sous-types de cancer et leur classification spécifique.",
    "Wählen Sie eine Körperregion, um Krebsarten, Untertypen und krankheitsspezifische Stadieneinteilungen zu erkunden."
  ],
  "Body model": [
    "Modelo corporal",
    "Modèle anatomique",
    "Körpermodell"
  ],
  "Select the anatomy to display.": [
    "Selecciona la anatomía que se mostrará.",
    "Sélectionnez l’anatomie à afficher.",
    "Wählen Sie die anzuzeigende Anatomie."
  ],
  "Gender": [
    "Sexo del modelo",
    "Sexe du modèle",
    "Modellgeschlecht"
  ],
  "Male": [
    "Masculino",
    "Masculin",
    "Männlich"
  ],
  "Female": [
    "Femenino",
    "Féminin",
    "Weiblich"
  ],
  "Body regions": [
    "Regiones del cuerpo",
    "Régions du corps",
    "Körperregionen"
  ],
  "Select a region here or directly on the model.": [
    "Selecciona una región aquí o directamente en el modelo.",
    "Sélectionnez une région ici ou directement sur le modèle.",
    "Wählen Sie eine Region hier oder direkt am Modell."
  ],
  "Anatomy view": [
    "Vista anatómica",
    "Vue anatomique",
    "Anatomische Ansicht"
  ],
  "Organs": [
    "Órganos",
    "Organes",
    "Organe"
  ],
  "Skeleton": [
    "Esqueleto",
    "Squelette",
    "Skelett"
  ],
  "Surface": [
    "Superficie",
    "Surface",
    "Oberfläche"
  ],
  "Organs view": [
    "Vista de órganos",
    "Vue des organes",
    "Organansicht"
  ],
  "Skeleton view": [
    "Vista del esqueleto",
    "Vue du squelette",
    "Skelettansicht"
  ],
  "Surface view": [
    "Vista de la superficie",
    "Vue de la surface",
    "Oberflächenansicht"
  ],
  "Drag to rotate · Scroll to zoom": [
    "Arrastra para girar · Desplaza para acercar",
    "Glissez pour tourner · Faites défiler pour zoomer",
    "Ziehen zum Drehen · Scrollen zum Zoomen"
  ],
  "Reset view": [
    "Restablecer vista",
    "Réinitialiser la vue",
    "Ansicht zurücksetzen"
  ],
  "Hide labels and markers": [
    "Ocultar etiquetas y marcadores",
    "Masquer les étiquettes et repères",
    "Beschriftungen und Markierungen ausblenden"
  ],
  "Show labels and markers": [
    "Mostrar etiquetas y marcadores",
    "Afficher les étiquettes et repères",
    "Beschriftungen und Markierungen anzeigen"
  ],
  "Back": [
    "Posterior",
    "Dos",
    "Hinten"
  ],
  "Front": [
    "Anterior",
    "Face",
    "Vorne"
  ],
  "Switch front / back view": [
    "Cambiar vista anterior / posterior",
    "Basculer face / dos",
    "Vorder- / Rückansicht wechseln"
  ],
  "For education and awareness. Not medical advice.": [
    "Información educativa y de sensibilización. No es asesoramiento médico.",
    "À visée éducative et de sensibilisation. Ne constitue pas un avis médical.",
    "Zur Information und Aufklärung. Keine medizinische Beratung."
  ],
  "About & sources": [
    "Acerca de y fuentes",
    "À propos et sources",
    "Über das Projekt und Quellen"
  ],
  "About onco-milver": [
    "Acerca de onco-milver",
    "À propos d’onco-milver",
    "Über onco-milver"
  ],
  "Explore anatomy and cancer types by body region.": [
    "Explora la anatomía y los tipos de cáncer por región corporal.",
    "Explorez l’anatomie et les types de cancer par région du corps.",
    "Erkunden Sie Anatomie und Krebsarten nach Körperregion."
  ],
  "Choose a model and a body region. Drag to rotate, scroll to zoom, and right-drag to pan. Switch between organs, skeleton, and surface views. Select an organ or use the region list to view the associated cancer topics.": [
    "Elige un modelo y una región corporal. Arrastra para girar, desplaza para acercar y arrastra con el botón derecho para mover la vista. Cambia entre órganos, esqueleto y superficie. Selecciona un órgano o usa la lista de regiones para consultar los temas de cáncer relacionados.",
    "Choisissez un modèle et une région. Glissez pour tourner, faites défiler pour zoomer et glissez avec le bouton droit pour déplacer la vue. Basculez entre les organes, le squelette et la surface. Sélectionnez un organe ou utilisez la liste pour consulter les cancers associés.",
    "Wählen Sie ein Modell und eine Körperregion. Ziehen Sie zum Drehen, scrollen Sie zum Zoomen und ziehen Sie mit der rechten Maustaste zum Verschieben. Wechseln Sie zwischen Organ-, Skelett- und Oberflächenansicht. Wählen Sie ein Organ oder einen Listeneintrag, um die zugehörigen Krebsthemen anzuzeigen."
  ],
  "Anatomy sources & licenses": [
    "Fuentes anatómicas y licencias",
    "Sources anatomiques et licences",
    "Anatomiequellen und Lizenzen"
  ],
  "Full attribution": [
    "Atribución completa",
    "Attribution complète",
    "Vollständige Quellenangabe"
  ],
  "Adaptation details": [
    "Detalles de la adaptación",
    "Détails des adaptations",
    "Details der Anpassungen"
  ],
  "Cancer information": [
    "Información sobre el cáncer",
    "Informations sur le cancer",
    "Informationen zu Krebs"
  ],
  "National Cancer Institute": [
    "Instituto Nacional del Cáncer de EE. UU.",
    "Institut national du cancer des États-Unis",
    "Nationales Krebsinstitut der USA"
  ],
  "Cancer map": [
    "Mapa del cáncer",
    "Carte des cancers",
    "Krebsübersicht"
  ],
  "Region → type → subtype → classification": [
    "Región → tipo → subtipo → clasificación",
    "Région → type → sous-type → classification",
    "Region → Krebsart → Untertyp → Klassifikation"
  ],
  "Cancer classification panel": [
    "Panel de clasificación del cáncer",
    "Panneau de classification des cancers",
    "Bereich zur Krebsklassifikation"
  ],
  "Move panel with arrow keys, or drag the header": [
    "Mueve el panel con las flechas o arrastra la cabecera",
    "Déplacez le panneau avec les flèches ou faites glisser l’en-tête",
    "Bereich mit Pfeiltasten verschieben oder Kopfzeile ziehen"
  ],
  "Drag header or use arrow keys to move": [
    "Arrastra la cabecera o usa las flechas para mover",
    "Glissez l’en-tête ou utilisez les flèches pour déplacer",
    "Kopfzeile ziehen oder Pfeiltasten zum Verschieben verwenden"
  ],
  "Dock panel on right": [
    "Acoplar el panel a la derecha",
    "Ancrer le panneau à droite",
    "Bereich rechts andocken"
  ],
  "Float panel to move and resize": [
    "Desacoplar para mover y redimensionar",
    "Détacher pour déplacer et redimensionner",
    "Zum Verschieben und Skalieren lösen"
  ],
  "Dock panel": [
    "Acoplar panel",
    "Ancrer le panneau",
    "Bereich andocken"
  ],
  "Float, move and resize": [
    "Desacoplar, mover y redimensionar",
    "Détacher, déplacer et redimensionner",
    "Lösen, verschieben und skalieren"
  ],
  "Sankey body region": [
    "Región corporal del Sankey",
    "Région du diagramme de Sankey",
    "Körperregion im Sankey-Diagramm"
  ],
  "All body regions": [
    "Todas las regiones",
    "Toutes les régions",
    "Alle Körperregionen"
  ],
  "Zoom out diagram": [
    "Alejar el diagrama",
    "Réduire le zoom du diagramme",
    "Diagramm verkleinern"
  ],
  "Reset diagram zoom": [
    "Restablecer el zoom",
    "Réinitialiser le zoom du diagramme",
    "Diagrammzoom zurücksetzen"
  ],
  "Zoom in diagram": [
    "Acercar el diagrama",
    "Agrandir le diagramme",
    "Diagramm vergrößern"
  ],
  "All cancer types": [
    "Todos los tipos de cáncer",
    "Tous les types de cancer",
    "Alle Krebsarten"
  ],
  "Show all subtypes": [
    "Mostrar todos los subtipos",
    "Afficher tous les sous-types",
    "Alle Untertypen anzeigen"
  ],
  "Hover or focus nodes to trace connections. Select a type or subtype to filter. Scroll inside the diagram to pan. Widths count classification links, not patients, prevalence, or risk. Stages are alternatives, not a progression timeline.": [
    "Pasa el cursor o enfoca los nodos para seguir las conexiones. Selecciona un tipo o subtipo para filtrar. Desplázate dentro del diagrama para recorrerlo. Los anchos cuentan relaciones de clasificación, no pacientes, prevalencia ni riesgo. Los estadios son alternativas, no una secuencia de progresión.",
    "Survolez ou ciblez les nœuds pour suivre les connexions. Sélectionnez un type ou sous-type pour filtrer. Faites défiler dans le diagramme pour vous déplacer. Les largeurs représentent des liens de classification, pas des patients, une prévalence ou un risque. Les stades sont des alternatives, pas une chronologie de progression.",
    "Bewegen Sie den Zeiger über Knoten oder fokussieren Sie diese, um Verbindungen zu verfolgen. Wählen Sie eine Krebsart oder einen Untertyp zum Filtern. Scrollen Sie im Diagramm zum Verschieben. Die Breiten zählen Klassifikationsbeziehungen, keine Patienten, Häufigkeiten oder Risiken. Stadien sind Alternativen und kein zeitlicher Krankheitsverlauf."
  ],
  "Select a region or cancer type to focus its classification map and synchronize the body model.": [
    "Selecciona una región o un tipo de cáncer para centrar el mapa y sincronizar el modelo corporal.",
    "Sélectionnez une région ou un type de cancer pour cibler sa classification et synchroniser le modèle.",
    "Wählen Sie eine Region oder Krebsart, um deren Klassifikation anzuzeigen und das Körpermodell abzugleichen."
  ],
  "Selected examples only. Staging is disease-specific; grades, phases, and disease status are explicitly labeled.": [
    "Solo ejemplos seleccionados. La estadificación depende de la enfermedad; los grados, las fases y el estado de la enfermedad se identifican por separado.",
    "Exemples sélectionnés uniquement. La stadification dépend de la maladie ; les grades, phases et états de la maladie sont indiqués séparément.",
    "Nur ausgewählte Beispiele. Stadieneinteilungen sind krankheitsspezifisch; Grade, Phasen und Krankheitsstatus werden gesondert gekennzeichnet."
  ],
  "NCI reference": [
    "Referencia del NCI",
    "Référence du NCI",
    "NCI-Quelle"
  ],
  "Dock cancer map here": [
    "Acoplar el mapa aquí",
    "Ancrer la carte ici",
    "Krebsübersicht hier andocken"
  ],
  "Body region": [
    "Región corporal",
    "Région du corps",
    "Körperregion"
  ],
  "Cancer type": [
    "Tipo de cáncer",
    "Type de cancer",
    "Krebsart"
  ],
  "Subtype": [
    "Subtipo",
    "Sous-type",
    "Untertyp"
  ],
  "Stage / classification": [
    "Estadio / clasificación",
    "Stade / classification",
    "Stadium / Klassifikation"
  ],
  "region": [
    "región",
    "région",
    "Region"
  ],
  "type": [
    "tipo",
    "type",
    "Krebsart"
  ],
  "subtype": [
    "subtipo",
    "sous-type",
    "Untertyp"
  ],
  "classification": [
    "clasificación",
    "classification",
    "Klassifikation"
  ],
  "Scrollable cancer classification Sankey": [
    "Sankey de clasificación del cáncer desplazable",
    "Diagramme de Sankey défilant de classification des cancers",
    "Scrollbares Sankey-Diagramm zur Krebsklassifikation"
  ],
  "Body region to cancer type to subtype to stage or classification. Links represent taxonomy relationships, not patient counts.": [
    "De región corporal a tipo de cáncer, subtipo y estadio o clasificación. Los enlaces representan relaciones de clasificación, no cantidades de pacientes.",
    "De la région du corps au type de cancer, au sous-type, puis au stade ou à la classification. Les liens représentent des relations de classification, pas des nombres de patients.",
    "Von der Körperregion über Krebsart und Untertyp zu Stadium oder Klassifikation. Verbindungen zeigen Klassifikationsbeziehungen, keine Patientenzahlen."
  ],
  "Classification relationship; not a patient count.": [
    "Relación de clasificación; no es una cantidad de pacientes.",
    "Relation de classification ; pas un nombre de patients.",
    "Klassifikationsbeziehung; keine Patientenzahl."
  ],
  "Select to filter the diagram.": [
    "Selecciona para filtrar el diagrama.",
    "Sélectionnez pour filtrer le diagramme.",
    "Zum Filtern des Diagramms auswählen."
  ],
  "Select for details.": [
    "Selecciona para ver los detalles.",
    "Sélectionnez pour afficher les détails.",
    "Für Details auswählen."
  ],
  "Model unavailable": [
    "Modelo no disponible",
    "Modèle indisponible",
    "Modell nicht verfügbar"
  ],
  "Check WebGL support and try reloading the model. Cancer topics are still available in the region list.": [
    "Comprueba la compatibilidad con WebGL e intenta cargar el modelo de nuevo. Los temas sobre cáncer siguen disponibles en la lista de regiones.",
    "Vérifiez la prise en charge de WebGL et rechargez le modèle. Les informations sur le cancer restent accessibles dans la liste des régions.",
    "Prüfen Sie die WebGL-Unterstützung und laden Sie das Modell erneut. Die Krebsthemen bleiben über die Regionsliste verfügbar."
  ],
  "Try again": [
    "Volver a intentar",
    "Réessayer",
    "Erneut versuchen"
  ],
  "Loading anatomical model…": [
    "Cargando el modelo anatómico…",
    "Chargement du modèle anatomique…",
    "Anatomisches Modell wird geladen…"
  ],
  "Detailed {gender} anatomical model, {view} view. Select body regions from the list or the model.": [
    "Modelo anatómico detallado {gender}, vista de {view}. Selecciona regiones en la lista o el modelo.",
    "Modèle anatomique détaillé {gender}, vue {view}. Sélectionnez une région dans la liste ou sur le modèle.",
    "Detailliertes anatomisches Modell: {gender}, Ansicht: {view}. Wählen Sie Körperregionen in der Liste oder am Modell."
  ],
  "Close": [
    "Cerrar",
    "Fermer",
    "Schließen"
  ],
  "Brain": [
    "Cerebro",
    "Cerveau",
    "Gehirn"
  ],
  "Head & neck": [
    "Cabeza y cuello",
    "Tête et cou",
    "Kopf und Hals"
  ],
  "Thyroid": [
    "Tiroides",
    "Thyroïde",
    "Schilddrüse"
  ],
  "Lungs": [
    "Pulmones",
    "Poumons",
    "Lunge"
  ],
  "Breast": [
    "Mama",
    "Sein",
    "Brust"
  ],
  "Esophagus": [
    "Esófago",
    "Œsophage",
    "Speiseröhre"
  ],
  "Stomach": [
    "Estómago",
    "Estomac",
    "Magen"
  ],
  "Liver": [
    "Hígado",
    "Foie",
    "Leber"
  ],
  "Pancreas": [
    "Páncreas",
    "Pancréas",
    "Bauchspeicheldrüse"
  ],
  "Colon & rectum": [
    "Colon y recto",
    "Côlon et rectum",
    "Dickdarm und Enddarm"
  ],
  "Kidneys": [
    "Riñones",
    "Reins",
    "Nieren"
  ],
  "Bladder": [
    "Vejiga",
    "Vessie",
    "Harnblase"
  ],
  "Prostate": [
    "Próstata",
    "Prostate",
    "Prostata"
  ],
  "Uterus & ovaries": [
    "Útero y ovarios",
    "Utérus et ovaires",
    "Gebärmutter und Eierstöcke"
  ],
  "Skin": [
    "Piel",
    "Peau",
    "Haut"
  ],
  "Bones": [
    "Huesos",
    "Os",
    "Knochen"
  ],
  "Blood & bone marrow": [
    "Sangre y médula ósea",
    "Sang et moelle osseuse",
    "Blut und Knochenmark"
  ],
  "Lymphatic system": [
    "Sistema linfático",
    "Système lymphatique",
    "Lymphsystem"
  ],
  "Nervous system": [
    "Sistema nervioso",
    "Système nerveux",
    "Nervensystem"
  ],
  "Head and neck": [
    "Cabeza y cuello",
    "Tête et cou",
    "Kopf und Hals"
  ],
  "Endocrine system": [
    "Sistema endocrino",
    "Système endocrinien",
    "Hormonsystem"
  ],
  "Respiratory system": [
    "Sistema respiratorio",
    "Système respiratoire",
    "Atmungssystem"
  ],
  "Breast tissue": [
    "Tejido mamario",
    "Tissu mammaire",
    "Brustgewebe"
  ],
  "Digestive system": [
    "Sistema digestivo",
    "Système digestif",
    "Verdauungssystem"
  ],
  "Digestive and endocrine systems": [
    "Sistemas digestivo y endocrino",
    "Systèmes digestif et endocrinien",
    "Verdauungs- und Hormonsystem"
  ],
  "Urinary system": [
    "Sistema urinario",
    "Système urinaire",
    "Harnsystem"
  ],
  "Reproductive system": [
    "Sistema reproductor",
    "Appareil reproducteur",
    "Fortpflanzungssystem"
  ],
  "Integumentary system": [
    "Sistema tegumentario",
    "Système tégumentaire",
    "Hautsystem"
  ],
  "Skeletal system": [
    "Sistema esquelético",
    "Système squelettique",
    "Skelettsystem"
  ],
  "Hematopoietic system": [
    "Sistema hematopoyético",
    "Système hématopoïétique",
    "Blutbildendes System"
  ],
  "Immune system": [
    "Sistema inmunitario",
    "Système immunitaire",
    "Immunsystem"
  ],
  "Explore selected primary brain tumors. Tumor grade is different from cancer stage.": [
    "Explora algunos tumores cerebrales primarios. El grado tumoral es diferente del estadio del cáncer.",
    "Explorez une sélection de tumeurs cérébrales primitives. Le grade tumoral est différent du stade du cancer.",
    "Erkunden Sie ausgewählte primäre Hirntumoren. Der Tumorgrad unterscheidet sich vom Krebsstadium."
  ],
  "Selected cancers of the oral cavity and larynx. Staging depends on the exact primary site.": [
    "Algunos cánceres de la cavidad oral y la laringe. La estadificación depende del lugar de origen exacto.",
    "Sélection de cancers de la cavité buccale et du larynx. La stadification dépend du site primitif exact.",
    "Ausgewählte Krebsarten der Mundhöhle und des Kehlkopfs. Die Stadieneinteilung hängt vom genauen Ursprungsort ab."
  ],
  "Thyroid cancer classification depends on histology; age also affects differentiated thyroid cancer stage.": [
    "La clasificación del cáncer de tiroides depende de la histología; la edad también influye en el estadio del cáncer diferenciado.",
    "La classification du cancer thyroïdien dépend de l’histologie ; l’âge influence aussi le stade des cancers différenciés.",
    "Die Klassifikation von Schilddrüsenkrebs hängt von der Histologie ab; bei differenzierten Karzinomen beeinflusst auch das Alter das Stadium."
  ],
  "Explore the main lung cancer groups and their histologic subtypes.": [
    "Explora los principales grupos de cáncer de pulmón y sus subtipos histológicos.",
    "Explorez les principaux groupes de cancers du poumon et leurs sous-types histologiques.",
    "Erkunden Sie die wichtigsten Lungenkrebsgruppen und ihre histologischen Untertypen."
  ],
  "Breast cancer can occur in both women and men. Histology and biomarkers are separate ways of classifying it.": [
    "El cáncer de mama puede afectar a mujeres y hombres. La histología y los biomarcadores son formas distintas de clasificarlo.",
    "Le cancer du sein peut toucher les femmes et les hommes. L’histologie et les biomarqueurs sont des modes de classification distincts.",
    "Brustkrebs kann bei Frauen und Männern auftreten. Histologie und Biomarker sind unterschiedliche Möglichkeiten der Klassifikation."
  ],
  "The esophagus carries food to the stomach. Its main cancer types arise in different lining cells.": [
    "El esófago transporta los alimentos al estómago. Sus principales tipos de cáncer se originan en distintas células del revestimiento.",
    "L’œsophage transporte les aliments vers l’estomac. Ses principaux cancers naissent dans différentes cellules de la muqueuse.",
    "Die Speiseröhre transportiert Nahrung zum Magen. Ihre wichtigsten Krebsarten entstehen in unterschiedlichen Zellen der Schleimhaut."
  ],
  "Selected gland-forming stomach cancers. Other stomach tumor types are not included in this map.": [
    "Algunos cánceres gástricos de origen glandular. El mapa no incluye otros tipos de tumores del estómago.",
    "Sélection de cancers gastriques glandulaires. Les autres types de tumeurs de l’estomac ne figurent pas sur cette carte.",
    "Ausgewählte drüsenbildende Magenkarzinome. Andere Magentumorarten sind in dieser Übersicht nicht enthalten."
  ],
  "Primary liver cancer begins in the liver; cancer that spreads here keeps the name of its original site.": [
    "El cáncer primario de hígado empieza en el hígado; el cáncer que se disemina a este órgano conserva el nombre de su lugar de origen.",
    "Le cancer primitif du foie débute dans le foie ; un cancer qui s’y propage conserve le nom de son site d’origine.",
    "Primärer Leberkrebs entsteht in der Leber; Krebs, der sich dorthin ausbreitet, behält den Namen seines Ursprungsorts."
  ],
  "Pancreatic cancers include exocrine cancers and pancreatic neuroendocrine tumors.": [
    "Los cánceres de páncreas incluyen cánceres exocrinos y tumores neuroendocrinos pancreáticos.",
    "Les cancers du pancréas comprennent les cancers exocrines et les tumeurs neuroendocrines pancréatiques.",
    "Zu den Pankreastumoren gehören exokrine Karzinome und neuroendokrine Tumoren."
  ],
  "Selected cancers of the large intestine. The model combines the colon and rectum in one mesh.": [
    "Algunos cánceres del intestino grueso. El modelo reúne el colon y el recto en una sola malla.",
    "Sélection de cancers du gros intestin. Le modèle regroupe le côlon et le rectum dans un seul maillage.",
    "Ausgewählte Krebsarten des Dickdarms. Das Modell fasst Dickdarm und Enddarm in einem Netz zusammen."
  ],
  "Explore selected renal cell cancers, which begin in the kidney tubules.": [
    "Explora algunos carcinomas de células renales, que se originan en los túbulos renales.",
    "Explorez une sélection de carcinomes à cellules rénales, qui débutent dans les tubules rénaux.",
    "Erkunden Sie ausgewählte Nierenzellkarzinome, die in den Nierenkanälchen entstehen."
  ],
  "The bladder stores urine. Urothelial carcinoma is its main cancer type.": [
    "La vejiga almacena la orina. Su principal tipo de cáncer es el carcinoma urotelial.",
    "La vessie stocke l’urine. Le carcinome urothélial est son principal type de cancer.",
    "Die Harnblase speichert Urin. Das Urothelkarzinom ist ihre häufigste Krebsart."
  ],
  "Explore prostate cancer histology and broad stage groups.": [
    "Explora la histología y los grupos generales de estadios del cáncer de próstata.",
    "Explorez l’histologie du cancer de la prostate et ses grands groupes de stades.",
    "Erkunden Sie Histologie und übergeordnete Stadiengruppen von Prostatakrebs."
  ],
  "Explore selected cancers of the uterus, cervix, and ovaries.": [
    "Explora algunos cánceres del útero, el cuello uterino y los ovarios.",
    "Explorez une sélection de cancers de l’utérus, du col de l’utérus et des ovaires.",
    "Erkunden Sie ausgewählte Krebsarten der Gebärmutter, des Gebärmutterhalses und der Eierstöcke."
  ],
  "Skin covers the whole body. Melanoma, basal cell carcinoma, and cutaneous squamous cell carcinoma have different classification systems.": [
    "La piel cubre todo el cuerpo. El melanoma, el carcinoma basocelular y el carcinoma escamocelular cutáneo tienen sistemas de clasificación distintos.",
    "La peau recouvre tout le corps. Le mélanome, le carcinome basocellulaire et le carcinome épidermoïde cutané ont des systèmes de classification différents.",
    "Die Haut bedeckt den ganzen Körper. Melanom, Basalzellkarzinom und kutanes Plattenepithelkarzinom haben unterschiedliche Klassifikationssysteme."
  ],
  "Primary bone cancers begin in bone. They are different from cancers that spread to bone from another site.": [
    "Los cánceres óseos primarios empiezan en el hueso. Son diferentes de los cánceres que se diseminan al hueso desde otro lugar.",
    "Les cancers osseux primitifs débutent dans l’os. Ils diffèrent des cancers qui se propagent aux os depuis un autre site.",
    "Primärer Knochenkrebs entsteht im Knochen. Er unterscheidet sich von Krebs, der sich von einem anderen Ort in die Knochen ausbreitet."
  ],
  "Leukemia and myeloma involve blood-forming cells and bone marrow. They are systemic diseases, not a tumor at one body point.": [
    "La leucemia y el mieloma afectan a las células formadoras de sangre y la médula ósea. Son enfermedades sistémicas, no un tumor localizado en un único punto.",
    "La leucémie et le myélome touchent les cellules sanguines en formation et la moelle osseuse. Ce sont des maladies systémiques, pas une tumeur en un seul point du corps.",
    "Leukämie und Myelom betreffen blutbildende Zellen und das Knochenmark. Es sind systemische Erkrankungen, keine Tumoren an einem einzelnen Körperpunkt."
  ],
  "Lymphomas develop in lymphocytes and can involve lymph nodes, spleen, marrow, and other organs throughout the body.": [
    "Los linfomas se desarrollan en los linfocitos y pueden afectar a los ganglios, el bazo, la médula y otros órganos de todo el cuerpo.",
    "Les lymphomes se développent dans les lymphocytes et peuvent toucher les ganglions, la rate, la moelle et d’autres organes dans tout le corps.",
    "Lymphome entstehen in Lymphozyten und können Lymphknoten, Milz, Knochenmark und weitere Organe im ganzen Körper betreffen."
  ],
  "Leukemia and myeloma involve blood-forming cells and marrow throughout the body. These tissues are not separately meshed; no single tumor site is marked.": [
    "La leucemia y el mieloma afectan a las células formadoras de sangre y la médula de todo el cuerpo. Estos tejidos no tienen mallas separadas; no se marca un único lugar tumoral.",
    "La leucémie et le myélome touchent les cellules sanguines en formation et la moelle dans tout le corps. Ces tissus ne sont pas maillés séparément ; aucun site tumoral unique n’est marqué.",
    "Leukämie und Myelom betreffen blutbildende Zellen und Knochenmark im ganzen Körper. Diese Gewebe sind nicht separat modelliert; es wird kein einzelner Tumorort markiert."
  ],
  "Spleen and thymus provide anatomical context. Lymph nodes and the full distributed lymphatic system are not separately shown.": [
    "El bazo y el timo aportan contexto anatómico. Los ganglios y el sistema linfático completo no se muestran por separado.",
    "La rate et le thymus fournissent un contexte anatomique. Les ganglions et l’ensemble du système lymphatique ne sont pas représentés séparément.",
    "Milz und Thymus dienen der anatomischen Orientierung. Lymphknoten und das gesamte verteilte Lymphsystem werden nicht separat dargestellt."
  ],
  "The skeleton is highlighted as a tissue system. This does not indicate a tumor in every bone or show bone marrow.": [
    "El esqueleto se resalta como sistema de tejidos. Esto no indica un tumor en cada hueso ni muestra la médula ósea.",
    "Le squelette est mis en évidence comme système tissulaire. Cela n’indique pas une tumeur dans chaque os et ne représente pas la moelle osseuse.",
    "Das Skelett wird als Gewebesystem hervorgehoben. Dies bedeutet nicht, dass jeder Knochen einen Tumor enthält, und zeigt kein Knochenmark."
  ],
  "Male breast tissue is not separately segmented in this dataset. Breast cancer information remains available for both models.": [
    "El tejido mamario masculino no está segmentado por separado en este conjunto de datos. La información sobre cáncer de mama está disponible para ambos modelos.",
    "Le tissu mammaire masculin n’est pas segmenté séparément dans ces données. Les informations sur le cancer du sein restent disponibles pour les deux modèles.",
    "Männliches Brustgewebe ist in diesem Datensatz nicht separat segmentiert. Informationen zu Brustkrebs sind für beide Modelle verfügbar."
  ],
  "The dataset groups the large intestine in one mesh; the rectum is not independently selectable.": [
    "El conjunto de datos agrupa el intestino grueso en una malla; el recto no se puede seleccionar por separado.",
    "Les données regroupent le gros intestin dans un seul maillage ; le rectum n’est pas sélectionnable séparément.",
    "Der Datensatz fasst den Dickdarm in einem Netz zusammen; der Enddarm ist nicht separat auswählbar."
  ],
  "Glioma": [
    "Glioma",
    "Gliome",
    "Gliom"
  ],
  "Astrocytoma, IDH-mutant": [
    "Astrocitoma con mutación de IDH",
    "Astrocytome avec mutation IDH",
    "Astrozytom, IDH-mutiert"
  ],
  "Oligodendroglioma": [
    "Oligodendroglioma",
    "Oligodendrogliome",
    "Oligodendrogliom"
  ],
  "Glioblastoma, IDH-wildtype": [
    "Glioblastoma sin mutación de IDH",
    "Glioblastome IDH sauvage",
    "Glioblastom, IDH-Wildtyp"
  ],
  "Head and neck cancer": [
    "Cáncer de cabeza y cuello",
    "Cancer de la tête et du cou",
    "Kopf-Hals-Krebs"
  ],
  "Oral cavity squamous carcinoma": [
    "Carcinoma escamocelular de la cavidad oral",
    "Carcinome épidermoïde de la cavité buccale",
    "Plattenepithelkarzinom der Mundhöhle"
  ],
  "Laryngeal squamous carcinoma": [
    "Carcinoma escamocelular de laringe",
    "Carcinome épidermoïde du larynx",
    "Plattenepithelkarzinom des Kehlkopfs"
  ],
  "Differentiated thyroid cancer": [
    "Cáncer diferenciado de tiroides",
    "Cancer différencié de la thyroïde",
    "Differenziertes Schilddrüsenkarzinom"
  ],
  "Papillary carcinoma": [
    "Carcinoma papilar",
    "Carcinome papillaire",
    "Papilläres Karzinom"
  ],
  "Follicular carcinoma": [
    "Carcinoma folicular",
    "Carcinome folliculaire",
    "Follikuläres Karzinom"
  ],
  "Medullary thyroid cancer": [
    "Cáncer medular de tiroides",
    "Cancer médullaire de la thyroïde",
    "Medulläres Schilddrüsenkarzinom"
  ],
  "Medullary carcinoma": [
    "Carcinoma medular",
    "Carcinome médullaire",
    "Medulläres Karzinom"
  ],
  "Anaplastic thyroid cancer": [
    "Cáncer anaplásico de tiroides",
    "Cancer anaplasique de la thyroïde",
    "Anaplastisches Schilddrüsenkarzinom"
  ],
  "Anaplastic carcinoma": [
    "Carcinoma anaplásico",
    "Carcinome anaplasique",
    "Anaplastisches Karzinom"
  ],
  "Non-small cell lung cancer": [
    "Cáncer de pulmón de células no pequeñas",
    "Cancer bronchique non à petites cellules",
    "Nichtkleinzelliger Lungenkrebs"
  ],
  "Adenocarcinoma": [
    "Adenocarcinoma",
    "Adénocarcinome",
    "Adenokarzinom"
  ],
  "Squamous cell carcinoma": [
    "Carcinoma escamocelular",
    "Carcinome épidermoïde",
    "Plattenepithelkarzinom"
  ],
  "Large cell carcinoma": [
    "Carcinoma de células grandes",
    "Carcinome à grandes cellules",
    "Großzelliges Karzinom"
  ],
  "Small cell lung cancer": [
    "Cáncer de pulmón de células pequeñas",
    "Cancer bronchique à petites cellules",
    "Kleinzelliger Lungenkrebs"
  ],
  "Small cell carcinoma": [
    "Carcinoma de células pequeñas",
    "Carcinome à petites cellules",
    "Kleinzelliges Karzinom"
  ],
  "Invasive breast cancer": [
    "Cáncer de mama invasivo",
    "Cancer du sein invasif",
    "Invasiver Brustkrebs"
  ],
  "Invasive ductal carcinoma": [
    "Carcinoma ductal invasivo",
    "Carcinome canalaire invasif",
    "Invasives duktales Karzinom"
  ],
  "Invasive lobular carcinoma": [
    "Carcinoma lobulillar invasivo",
    "Carcinome lobulaire invasif",
    "Invasives lobuläres Karzinom"
  ],
  "Ductal carcinoma in situ": [
    "Carcinoma ductal in situ",
    "Carcinome canalaire in situ",
    "Duktales Carcinoma in situ"
  ],
  "Esophageal cancer": [
    "Cáncer de esófago",
    "Cancer de l’œsophage",
    "Speiseröhrenkrebs"
  ],
  "Gastric adenocarcinoma": [
    "Adenocarcinoma gástrico",
    "Adénocarcinome gastrique",
    "Magenadenokarzinom"
  ],
  "Intestinal type": [
    "Tipo intestinal",
    "Type intestinal",
    "Intestinaler Typ"
  ],
  "Diffuse type": [
    "Tipo difuso",
    "Type diffus",
    "Diffuser Typ"
  ],
  "Primary liver cancer": [
    "Cáncer primario de hígado",
    "Cancer primitif du foie",
    "Primärer Leberkrebs"
  ],
  "Hepatocellular carcinoma": [
    "Carcinoma hepatocelular",
    "Carcinome hépatocellulaire",
    "Hepatozelluläres Karzinom"
  ],
  "Exocrine pancreatic cancer": [
    "Cáncer de páncreas exocrino",
    "Cancer exocrine du pancréas",
    "Exokriner Bauchspeicheldrüsenkrebs"
  ],
  "Ductal adenocarcinoma": [
    "Adenocarcinoma ductal",
    "Adénocarcinome canalaire",
    "Duktales Adenokarzinom"
  ],
  "Pancreatic neuroendocrine tumor": [
    "Tumor neuroendocrino pancreático",
    "Tumeur neuroendocrine pancréatique",
    "Neuroendokriner Pankreastumor"
  ],
  "Well-differentiated pancreatic NET": [
    "Tumor neuroendocrino pancreático bien diferenciado",
    "Tumeur neuroendocrine pancréatique bien différenciée",
    "Gut differenzierter neuroendokriner Pankreastumor"
  ],
  "Colorectal cancer": [
    "Cáncer colorrectal",
    "Cancer colorectal",
    "Darmkrebs"
  ],
  "Colon adenocarcinoma": [
    "Adenocarcinoma de colon",
    "Adénocarcinome du côlon",
    "Kolonadenokarzinom"
  ],
  "Rectal adenocarcinoma": [
    "Adenocarcinoma de recto",
    "Adénocarcinome du rectum",
    "Rektumadenokarzinom"
  ],
  "Renal cell carcinoma": [
    "Carcinoma de células renales",
    "Carcinome à cellules rénales",
    "Nierenzellkarzinom"
  ],
  "Clear cell RCC": [
    "Carcinoma renal de células claras",
    "Carcinome rénal à cellules claires",
    "Klarzelliges Nierenzellkarzinom"
  ],
  "Papillary RCC": [
    "Carcinoma renal papilar",
    "Carcinome rénal papillaire",
    "Papilläres Nierenzellkarzinom"
  ],
  "Chromophobe RCC": [
    "Carcinoma renal cromófobo",
    "Carcinome rénal chromophobe",
    "Chromophobes Nierenzellkarzinom"
  ],
  "Bladder cancer": [
    "Cáncer de vejiga",
    "Cancer de la vessie",
    "Blasenkrebs"
  ],
  "Urothelial carcinoma": [
    "Carcinoma urotelial",
    "Carcinome urothélial",
    "Urothelkarzinom"
  ],
  "Prostate cancer": [
    "Cáncer de próstata",
    "Cancer de la prostate",
    "Prostatakrebs"
  ],
  "Acinar adenocarcinoma": [
    "Adenocarcinoma acinar",
    "Adénocarcinome acinaire",
    "Azinäres Adenokarzinom"
  ],
  "Endometrial cancer": [
    "Cáncer de endometrio",
    "Cancer de l’endomètre",
    "Endometriumkarzinom"
  ],
  "Endometrioid carcinoma": [
    "Carcinoma endometrioide",
    "Carcinome endométrioïde",
    "Endometrioides Karzinom"
  ],
  "Serous carcinoma": [
    "Carcinoma seroso",
    "Carcinome séreux",
    "Seröses Karzinom"
  ],
  "Cervical cancer": [
    "Cáncer de cuello uterino",
    "Cancer du col de l’utérus",
    "Gebärmutterhalskrebs"
  ],
  "Ovarian cancer": [
    "Cáncer de ovario",
    "Cancer de l’ovaire",
    "Eierstockkrebs"
  ],
  "Epithelial ovarian carcinoma": [
    "Carcinoma epitelial de ovario",
    "Carcinome épithélial de l’ovaire",
    "Epitheliales Ovarialkarzinom"
  ],
  "Melanoma": [
    "Melanoma",
    "Mélanome",
    "Melanom"
  ],
  "Cutaneous melanoma": [
    "Melanoma cutáneo",
    "Mélanome cutané",
    "Kutanes Melanom"
  ],
  "Keratinocyte cancer": [
    "Cáncer de queratinocitos",
    "Cancer kératinocytaire",
    "Keratinozytenkrebs"
  ],
  "Basal cell carcinoma": [
    "Carcinoma basocelular",
    "Carcinome basocellulaire",
    "Basalzellkarzinom"
  ],
  "Cutaneous squamous carcinoma": [
    "Carcinoma escamocelular cutáneo",
    "Carcinome épidermoïde cutané",
    "Kutanes Plattenepithelkarzinom"
  ],
  "Primary bone sarcoma": [
    "Sarcoma óseo primario",
    "Sarcome osseux primitif",
    "Primäres Knochensarkom"
  ],
  "Osteosarcoma": [
    "Osteosarcoma",
    "Ostéosarcome",
    "Osteosarkom"
  ],
  "Ewing sarcoma": [
    "Sarcoma de Ewing",
    "Sarcome d’Ewing",
    "Ewing-Sarkom"
  ],
  "Chondrosarcoma": [
    "Condrosarcoma",
    "Chondrosarcome",
    "Chondrosarkom"
  ],
  "Leukemia": [
    "Leucemia",
    "Leucémie",
    "Leukämie"
  ],
  "Acute lymphoblastic leukemia (ALL)": [
    "Leucemia linfoblástica aguda (LLA)",
    "Leucémie aiguë lymphoblastique (LAL)",
    "Akute lymphatische Leukämie (ALL)"
  ],
  "Acute myeloid leukemia (AML)": [
    "Leucemia mieloide aguda (LMA)",
    "Leucémie aiguë myéloïde (LAM)",
    "Akute myeloische Leukämie (AML)"
  ],
  "Chronic lymphocytic leukemia (CLL)": [
    "Leucemia linfocítica crónica (LLC)",
    "Leucémie lymphoïde chronique (LLC)",
    "Chronische lymphatische Leukämie (CLL)"
  ],
  "Chronic myeloid leukemia (CML)": [
    "Leucemia mieloide crónica (LMC)",
    "Leucémie myéloïde chronique (LMC)",
    "Chronische myeloische Leukämie (CML)"
  ],
  "Multiple myeloma": [
    "Mieloma múltiple",
    "Myélome multiple",
    "Multiples Myelom"
  ],
  "Plasma cell myeloma": [
    "Mieloma de células plasmáticas",
    "Myélome à plasmocytes",
    "Plasmazellmyelom"
  ],
  "Lymphoma": [
    "Linfoma",
    "Lymphome",
    "Lymphom"
  ],
  "Classical Hodgkin lymphoma": [
    "Linfoma de Hodgkin clásico",
    "Lymphome de Hodgkin classique",
    "Klassisches Hodgkin-Lymphom"
  ],
  "Diffuse large B-cell lymphoma": [
    "Linfoma difuso de células B grandes",
    "Lymphome diffus à grandes cellules B",
    "Diffuses großzelliges B-Zell-Lymphom"
  ],
  "Follicular lymphoma": [
    "Linfoma folicular",
    "Lymphome folliculaire",
    "Follikuläres Lymphom"
  ],
  "Broad stage groups": [
    "Grupos generales de estadios",
    "Grands groupes de stades",
    "Übergeordnete Stadiengruppen"
  ],
  "Extent / disease status": [
    "Extensión / estado de la enfermedad",
    "Extension / état de la maladie",
    "Ausbreitung / Krankheitsstatus"
  ],
  "Localized": [
    "Localizado",
    "Localisé",
    "Lokalisiert"
  ],
  "Metastatic": [
    "Metastásico",
    "Métastatique",
    "Metastasiert"
  ],
  "Recurrent": [
    "Recurrente",
    "Récidivant",
    "Rezidiviert"
  ],
  "Disease status (not stage)": [
    "Estado de la enfermedad (no estadio)",
    "État de la maladie (pas un stade)",
    "Krankheitsstatus (kein Stadium)"
  ],
  "Newly diagnosed": [
    "Recién diagnosticado",
    "Nouvellement diagnostiqué",
    "Neu diagnostiziert"
  ],
  "In remission": [
    "En remisión",
    "En rémission",
    "In Remission"
  ],
  "Recurrent / refractory": [
    "Recurrente / resistente al tratamiento",
    "Récidivant / réfractaire",
    "Rezidiviert / refraktär"
  ],
  "CNS WHO grade (not stage)": [
    "Grado OMS del SNC (no estadio)",
    "Grade OMS du SNC (pas un stade)",
    "ZNS-WHO-Grad (kein Stadium)"
  ],
  "Age-dependent stage groups": [
    "Grupos de estadios según la edad",
    "Groupes de stades selon l’âge",
    "Altersabhängige Stadiengruppen"
  ],
  "Under 55: stages I–II": [
    "Menores de 55: estadios I–II",
    "Moins de 55 ans : stades I–II",
    "Unter 55: Stadien I–II"
  ],
  "55 or older: stages I–IV": [
    "55 años o más: estadios I–IV",
    "55 ans ou plus : stades I–IV",
    "Ab 55: Stadien I–IV"
  ],
  "Stage IV subgroups": [
    "Subgrupos del estadio IV",
    "Sous-groupes du stade IV",
    "Untergruppen von Stadium IV"
  ],
  "Limited / extensive classification": [
    "Clasificación limitada / diseminada",
    "Classification limitée / étendue",
    "Einteilung in begrenzt / ausgedehnt"
  ],
  "Limited stage": [
    "Estadio limitado",
    "Stade limité",
    "Begrenztes Stadium"
  ],
  "Extensive stage": [
    "Estadio diseminado",
    "Stade étendu",
    "Ausgedehntes Stadium"
  ],
  "In situ stage": [
    "Estadio in situ",
    "Stade in situ",
    "In-situ-Stadium"
  ],
  "Risk / extent assessment": [
    "Evaluación del riesgo / extensión",
    "Évaluation du risque / de l’extension",
    "Risiko- / Ausbreitungsbeurteilung"
  ],
  "Risk-based assessment": [
    "Evaluación basada en el riesgo",
    "Évaluation fondée sur le risque",
    "Risikobasierte Beurteilung"
  ],
  "Site-specific staging": [
    "Estadificación según la localización",
    "Stadification selon le site",
    "Lokalisation­spezifische Stadieneinteilung"
  ],
  "Site-specific TNM assessment": [
    "Evaluación TNM según la localización",
    "Évaluation TNM selon le site",
    "Lokalisation­spezifische TNM-Beurteilung"
  ],
  "Rai stage": [
    "Estadio Rai",
    "Stade de Rai",
    "Rai-Stadium"
  ],
  "CML phase (NCI PDQ)": [
    "Fase de LMC (PDQ del NCI)",
    "Phase de LMC (PDQ du NCI)",
    "CML-Phase (NCI-PDQ)"
  ],
  "Chronic phase": [
    "Fase crónica",
    "Phase chronique",
    "Chronische Phase"
  ],
  "Accelerated phase": [
    "Fase acelerada",
    "Phase accélérée",
    "Akzelerierte Phase"
  ],
  "Blastic phase": [
    "Fase blástica",
    "Phase blastique",
    "Blastenphase"
  ],
  "ISS stage": [
    "Estadio ISS",
    "Stade ISS",
    "ISS-Stadium"
  ],
  "Lymphoma stage": [
    "Estadio del linfoma",
    "Stade du lymphome",
    "Lymphomstadium"
  ],
  "Selected histologic or disease subtypes in this cancer group. This map is not exhaustive.": [
    "Subtipos histológicos o de enfermedad seleccionados de este grupo de cáncer. Este mapa no es exhaustivo.",
    "Sélection de sous-types histologiques ou de maladies de ce groupe de cancers. Cette carte n’est pas exhaustive.",
    "Ausgewählte histologische oder krankheitsbezogene Untertypen dieser Krebsgruppe. Diese Übersicht ist nicht vollständig."
  ],
  "Selected broad stage groups, not a staging calculator. Clinical and pathological staging, biomarkers, and substages require disease-specific assessment.": [
    "Grupos generales de estadios seleccionados; no es una calculadora de estadificación. La estadificación clínica y patológica, los biomarcadores y los subestadios requieren una evaluación específica de la enfermedad.",
    "Grands groupes de stades sélectionnés ; ce n’est pas un calculateur de stade. Les stades cliniques et pathologiques, les biomarqueurs et les sous-stades nécessitent une évaluation propre à la maladie.",
    "Ausgewählte übergeordnete Stadiengruppen, kein Stadienrechner. Klinische und pathologische Stadieneinteilung, Biomarker und Unterstadien erfordern eine krankheitsspezifische Beurteilung."
  ],
  "Treatment-oriented extent or disease status, not TNM stage groups. Recurrence is a disease status and can occur at different extents.": [
    "Extensión o estado de la enfermedad con fines terapéuticos, no grupos de estadios TNM. La recurrencia es un estado de la enfermedad y puede presentarse con distintas extensiones.",
    "Extension ou état de la maladie à visée thérapeutique, pas des groupes de stades TNM. La récidive est un état de la maladie et peut survenir à différents degrés d’extension.",
    "Therapiebezogene Ausbreitung oder Krankheitsstatus, keine TNM-Stadiengruppen. Ein Rezidiv ist ein Krankheitsstatus und kann bei unterschiedlicher Ausbreitung auftreten."
  ],
  "Acute leukemias do not use a standard stage I–IV system. These are disease-status categories, not a required sequence of progression.": [
    "Las leucemias agudas no usan un sistema estándar de estadios I–IV. Son categorías del estado de la enfermedad, no una secuencia obligatoria de progresión.",
    "Les leucémies aiguës n’utilisent pas de système standard de stades I–IV. Il s’agit d’états de la maladie, pas d’une séquence obligatoire de progression.",
    "Akute Leukämien verwenden kein standardmäßiges Stadium-I–IV-System. Dies sind Kategorien des Krankheitsstatus, keine zwangsläufige Abfolge des Krankheitsverlaufs."
  ],
  "CNS WHO grade describes tumor biology; it is not a measure of spread or a TNM cancer stage.": [
    "El grado OMS del SNC describe la biología tumoral; no mide la extensión ni es un estadio TNM.",
    "Le grade OMS du SNC décrit la biologie tumorale ; ce n’est ni une mesure de l’extension ni un stade TNM.",
    "Der ZNS-WHO-Grad beschreibt die Tumorbiologie; er ist weder ein Maß für die Ausbreitung noch ein TNM-Krebsstadium."
  ],
  "IDH-mutant, 1p/19q-codeleted oligodendroglioma is graded 2 or 3; grade is not stage.": [
    "El oligodendroglioma con mutación de IDH y codeleción 1p/19q es de grado 2 o 3; el grado no es el estadio.",
    "L’oligodendrogliome avec mutation IDH et codélétion 1p/19q est de grade 2 ou 3 ; le grade n’est pas le stade.",
    "Das IDH-mutierte, 1p/19q-kodeletierte Oligodendrogliom hat Grad 2 oder 3; Grad ist nicht Stadium."
  ],
  "Glioblastoma is a CNS WHO grade 4 tumor. Grade 4 does not mean stage IV.": [
    "El glioblastoma es un tumor de grado 4 de la OMS del SNC. El grado 4 no significa estadio IV.",
    "Le glioblastome est une tumeur de grade 4 OMS du SNC. Le grade 4 ne signifie pas stade IV.",
    "Das Glioblastom ist ein Tumor des ZNS-WHO-Grads 4. Grad 4 bedeutet nicht Stadium IV."
  ],
  "For differentiated thyroid cancer, the stage framework changes at age 55. These are conditional stage ranges, not individual stage assignments.": [
    "En el cáncer diferenciado de tiroides, el sistema de estadios cambia a los 55 años. Son intervalos de estadios condicionados por la edad, no asignaciones individuales.",
    "Pour le cancer différencié de la thyroïde, le système de stades change à 55 ans. Ce sont des plages conditionnelles, pas l’attribution d’un stade individuel.",
    "Bei differenziertem Schilddrüsenkrebs ändert sich das Stadiensystem ab 55 Jahren. Dies sind bedingte Stadienbereiche, keine individuellen Stadienzuweisungen."
  ],
  "All anaplastic thyroid cancers are classified within stage IV; IVA, IVB, and IVC describe different extents.": [
    "Todos los cánceres anaplásicos de tiroides se clasifican en estadio IV; IVA, IVB y IVC describen distintas extensiones.",
    "Tous les cancers anaplasiques de la thyroïde sont classés au stade IV ; IVA, IVB et IVC décrivent différentes extensions.",
    "Alle anaplastischen Schilddrüsenkarzinome werden Stadium IV zugeordnet; IVA, IVB und IVC beschreiben unterschiedliche Ausbreitungen."
  ],
  "Small cell lung cancer is often described as limited or extensive. TNM staging may also be used; these are not subtypes of non-small cell lung cancer.": [
    "El cáncer de pulmón de células pequeñas suele describirse como limitado o diseminado. También puede usarse la estadificación TNM; no son subtipos del cáncer de células no pequeñas.",
    "Le cancer bronchique à petites cellules est souvent décrit comme limité ou étendu. La stadification TNM peut aussi être utilisée ; ce ne sont pas des sous-types du cancer non à petites cellules.",
    "Kleinzelliger Lungenkrebs wird häufig als begrenzt oder ausgedehnt beschrieben. Auch TNM kann verwendet werden; dies sind keine Untertypen des nichtkleinzelligen Lungenkrebses."
  ],
  "DCIS is noninvasive disease (stage 0). Invasive breast cancers use additional stage and biomarker information.": [
    "El carcinoma ductal in situ es una enfermedad no invasiva (estadio 0). En el cáncer de mama invasivo se utiliza información adicional sobre estadios y biomarcadores.",
    "Le carcinome canalaire in situ est une maladie non invasive (stade 0). Les cancers du sein invasifs utilisent des informations supplémentaires sur les stades et les biomarqueurs.",
    "DCIS ist eine nichtinvasive Erkrankung (Stadium 0). Bei invasivem Brustkrebs werden zusätzliche Stadien- und Biomarkerinformationen verwendet."
  ],
  "Routine TNM staging is generally not used for basal cell carcinoma. Risk, site, size, recurrence, and advanced disease assessment guide classification.": [
    "En el carcinoma basocelular no suele usarse la estadificación TNM de forma rutinaria. La clasificación depende del riesgo, la localización, el tamaño, la recurrencia y la evaluación de la enfermedad avanzada.",
    "La stadification TNM n’est généralement pas utilisée en routine pour le carcinome basocellulaire. Le risque, le site, la taille, la récidive et l’évaluation des formes avancées guident la classification.",
    "Beim Basalzellkarzinom wird TNM in der Regel nicht routinemäßig verwendet. Risiko, Lokalisation, Größe, Rezidiv und die Beurteilung fortgeschrittener Erkrankung bestimmen die Klassifikation."
  ],
  "Cutaneous SCC staging depends on the anatomical site and staging system. A single universal stage list is not assigned here.": [
    "La estadificación del carcinoma escamocelular cutáneo depende de la localización y del sistema utilizado. Aquí no se asigna una lista universal de estadios.",
    "La stadification du carcinome épidermoïde cutané dépend du site et du système utilisé. Aucune liste universelle de stades n’est attribuée ici.",
    "Die Stadieneinteilung des kutanen Plattenepithelkarzinoms hängt von Lokalisation und System ab. Hier wird keine einheitliche universelle Stadienliste zugewiesen."
  ],
  "Rai is one CLL staging system; Binet is another. Rai stages are not solid-tumor TNM stages.": [
    "Rai es un sistema de estadificación de la LLC; Binet es otro. Los estadios Rai no son estadios TNM de tumores sólidos.",
    "Rai est un système de stadification de la LLC ; Binet en est un autre. Les stades de Rai ne sont pas les stades TNM des tumeurs solides.",
    "Rai ist ein Stadiensystem für CLL; Binet ist ein weiteres. Rai-Stadien sind keine TNM-Stadien solider Tumoren."
  ],
  "NCI PDQ describes these phases. CML classification differs between contemporary systems; these phases are not TNM stages.": [
    "El PDQ del NCI describe estas fases. La clasificación de la LMC varía entre los sistemas actuales; estas fases no son estadios TNM.",
    "Le PDQ du NCI décrit ces phases. La classification de la LMC diffère entre les systèmes actuels ; ces phases ne sont pas des stades TNM.",
    "Das NCI-PDQ beschreibt diese Phasen. Die CML-Klassifikation unterscheidet sich zwischen aktuellen Systemen; diese Phasen sind keine TNM-Stadien."
  ],
  "The International Staging System uses laboratory markers. Revised systems add further prognostic information; this is not bone-cancer staging.": [
    "El Sistema Internacional de Estadificación utiliza marcadores de laboratorio. Los sistemas revisados añaden información pronóstica; no es la estadificación del cáncer óseo.",
    "Le système international de stadification utilise des marqueurs biologiques. Les systèmes révisés ajoutent des informations pronostiques ; il ne s’agit pas de la stadification d’un cancer osseux.",
    "Das International Staging System verwendet Labormarker. Überarbeitete Systeme ergänzen weitere Prognoseinformationen; dies ist keine Stadieneinteilung von Knochenkrebs."
  ],
  "Lung lobes and thyroid: Z-Anatomy, derived from BodyParts3D © The Database Center for Life Science, CC BY-SA 4.0. These meshes are extracted and registered to the base atlas; female geometry is scaled to torso landmarks.": [
    "Lóbulos pulmonares y tiroides: Z-Anatomy, derivado de BodyParts3D © The Database Center for Life Science, CC BY-SA 4.0. Las mallas se extraen y alinean con el atlas base; la geometría femenina se ajusta a referencias del torso.",
    "Lobes pulmonaires et thyroïde : Z-Anatomy, dérivé de BodyParts3D © The Database Center for Life Science, CC BY-SA 4.0. Ces maillages sont extraits et alignés sur l’atlas de base ; la géométrie féminine est ajustée aux repères du torse.",
    "Lungenlappen und Schilddrüse: Z-Anatomy, abgeleitet von BodyParts3D © The Database Center for Life Science, CC BY-SA 4.0. Diese Netze wurden extrahiert und am Basisatlas ausgerichtet; die weibliche Geometrie wurde an Rumpflandmarken angepasst."
  ],
  "The female model fits shared BodyParts3D structures to a MakeHuman surface and adds Human Reference Atlas breast and reproductive organs. It is an adapted educational model, not an independently scanned or clinically validated female atlas. Male breast tissue is not separately segmented. Colon and rectum are grouped in one mesh.": [
    "El modelo femenino adapta estructuras compartidas de BodyParts3D a una superficie de MakeHuman y añade órganos mamarios y reproductores del Human Reference Atlas. Es un modelo educativo adaptado, no un atlas femenino escaneado de forma independiente ni validado clínicamente. El tejido mamario masculino no está segmentado por separado. El colon y el recto se agrupan en una malla.",
    "Le modèle féminin adapte des structures partagées de BodyParts3D à une surface MakeHuman et ajoute des organes mammaires et reproducteurs du Human Reference Atlas. Il s’agit d’un modèle éducatif adapté, pas d’un atlas féminin scanné indépendamment ou validé cliniquement. Le tissu mammaire masculin n’est pas segmenté séparément. Le côlon et le rectum sont regroupés dans un maillage.",
    "Das weibliche Modell passt gemeinsame BodyParts3D-Strukturen an eine MakeHuman-Oberfläche an und ergänzt Brust- und Fortpflanzungsorgane aus dem Human Reference Atlas. Es ist ein angepasstes Lehrmodell, kein unabhängig gescannter oder klinisch validierter weiblicher Atlas. Männliches Brustgewebe ist nicht separat segmentiert. Dickdarm und Enddarm sind in einem Netz zusammengefasst."
  ],
  "The cancer map links regions to selected types, subtypes, and stage or classification alternatives. Its link widths count taxonomy relationships, not patients or risk. Stages are alternatives, not a disease progression timeline. Grades, phases, and disease status are labeled separately. The selected cancer examples link to the National Cancer Institute. This is not an exhaustive cancer catalog or an individual risk assessment. Model options represent typical anatomy and do not determine an individual’s organs or cancer risk.": [
    "El mapa conecta regiones con tipos, subtipos y alternativas de estadio o clasificación seleccionados. Los anchos cuentan relaciones de clasificación, no pacientes ni riesgo. Los estadios son alternativas, no una secuencia de progresión. Los grados, las fases y el estado de la enfermedad se indican por separado. Los ejemplos enlazan al National Cancer Institute. No es un catálogo exhaustivo ni una evaluación individual del riesgo. Los modelos representan anatomías típicas y no determinan los órganos ni el riesgo de cáncer de una persona.",
    "La carte relie les régions à une sélection de types, sous-types et alternatives de stade ou de classification. La largeur des liens représente des relations de classification, pas des patients ni un risque. Les stades sont des alternatives, pas une chronologie d’évolution. Grades, phases et états de la maladie sont indiqués séparément. Les exemples renvoient au National Cancer Institute. Ce n’est ni un catalogue exhaustif ni une évaluation individuelle du risque. Les modèles représentent des anatomies typiques et ne déterminent pas les organes ni le risque de cancer d’une personne.",
    "Die Übersicht verbindet Regionen mit ausgewählten Krebsarten, Untertypen und Stadien- oder Klassifikationsalternativen. Die Verbindungsbreiten zählen Klassifikationsbeziehungen, keine Patienten oder Risiken. Stadien sind Alternativen, kein zeitlicher Krankheitsverlauf. Grade, Phasen und Krankheitsstatus sind separat gekennzeichnet. Die Beispiele verlinken auf das National Cancer Institute. Dies ist weder ein vollständiger Krebskatalog noch eine individuelle Risikobewertung. Die Modelle zeigen typische Anatomie und bestimmen weder die Organe noch das Krebsrisiko eines Menschen."
  ],
  "Original source attribution": [
    "Atribución original de las fuentes",
    "Attribution originale des sources",
    "Originale Quellenangabe"
  ],
  "Reference pages may be in English.": [
    "Las páginas de referencia pueden estar en inglés.",
    "Les pages de référence peuvent être en anglais.",
    "Quellenseiten können auf Englisch sein."
  ],
  "Left": [
    "Izquierdo",
    "Gauche",
    "Links"
  ],
  "Right": [
    "Derecho",
    "Droit",
    "Rechts"
  ],
  "Adrenal Gland": [
    "Glándula suprarrenal",
    "Glande surrénale",
    "Nebenniere"
  ],
  "Appendix": [
    "Apéndice",
    "Appendice",
    "Wurmfortsatz"
  ],
  "Brainstem": [
    "Tronco encefálico",
    "Tronc cérébral",
    "Hirnstamm"
  ],
  "Bronchi": [
    "Bronquios",
    "Bronches",
    "Bronchien"
  ],
  "Cerebellum": [
    "Cerebelo",
    "Cervelet",
    "Kleinhirn"
  ],
  "Eye": [
    "Ojo",
    "Œil",
    "Auge"
  ],
  "Fallopian Tubes": [
    "Trompas de Falopio",
    "Trompes utérines",
    "Eileiter"
  ],
  "Gallbladder & Bile Ducts": [
    "Vesícula y vías biliares",
    "Vésicule et voies biliaires",
    "Gallenblase und Gallenwege"
  ],
  "Heart": [
    "Corazón",
    "Cœur",
    "Herz"
  ],
  "Kidney": [
    "Riñón",
    "Rein",
    "Niere"
  ],
  "Large Intestine (Colon)": [
    "Intestino grueso (colon)",
    "Gros intestin (côlon)",
    "Dickdarm (Kolon)"
  ],
  "Larynx (Voice Box)": [
    "Laringe",
    "Larynx",
    "Kehlkopf"
  ],
  "Lung": [
    "Pulmón",
    "Poumon",
    "Lunge"
  ],
  "Male Reproductive Organs": [
    "Órganos reproductores masculinos",
    "Organes reproducteurs masculins",
    "Männliche Fortpflanzungsorgane"
  ],
  "Ovary": [
    "Ovario",
    "Ovaire",
    "Eierstock"
  ],
  "Pharynx (Throat)": [
    "Faringe",
    "Pharynx",
    "Rachen"
  ],
  "Pituitary Gland": [
    "Hipófisis",
    "Hypophyse",
    "Hypophyse"
  ],
  "Salivary Glands": [
    "Glándulas salivales",
    "Glandes salivaires",
    "Speicheldrüsen"
  ],
  "Small Intestine": [
    "Intestino delgado",
    "Intestin grêle",
    "Dünndarm"
  ],
  "Spleen": [
    "Bazo",
    "Rate",
    "Milz"
  ],
  "Thymus": [
    "Timo",
    "Thymus",
    "Thymus"
  ],
  "Tongue": [
    "Lengua",
    "Langue",
    "Zunge"
  ],
  "Trachea": [
    "Tráquea",
    "Trachée",
    "Luftröhre"
  ],
  "Ureter": [
    "Uréter",
    "Uretère",
    "Harnleiter"
  ],
  "Urinary Bladder": [
    "Vejiga urinaria",
    "Vessie urinaire",
    "Harnblase"
  ],
  "Uterus": [
    "Útero",
    "Utérus",
    "Gebärmutter"
  ],
  "Vagina": [
    "Vagina",
    "Vagin",
    "Vagina"
  ],
  "Cervical Spine (Neck)": [
    "Columna cervical (cuello)",
    "Rachis cervical (cou)",
    "Halswirbelsäule"
  ],
  "Collarbone": [
    "Clavícula",
    "Clavicule",
    "Schlüsselbein"
  ],
  "Foot": [
    "Pie",
    "Pied",
    "Fuß"
  ],
  "Forearm Bones": [
    "Huesos del antebrazo",
    "Os de l’avant-bras",
    "Unterarmknochen"
  ],
  "Hand": [
    "Mano",
    "Main",
    "Hand"
  ],
  "Jaw (Mandible)": [
    "Mandíbula",
    "Mandibule",
    "Unterkiefer"
  ],
  "Kneecap": [
    "Rótula",
    "Patella",
    "Kniescheibe"
  ],
  "Lumbar Spine (Lower Back)": [
    "Columna lumbar",
    "Rachis lombaire",
    "Lendenwirbelsäule"
  ],
  "Pelvis & Sacrum": [
    "Pelvis y sacro",
    "Bassin et sacrum",
    "Becken und Kreuzbein"
  ],
  "Ribs": [
    "Costillas",
    "Côtes",
    "Rippen"
  ],
  "Shin Bones": [
    "Huesos de la pierna",
    "Os de la jambe",
    "Unterschenkelknochen"
  ],
  "Shoulder Blade": [
    "Escápula",
    "Scapula",
    "Schulterblatt"
  ],
  "Skull": [
    "Cráneo",
    "Crâne",
    "Schädel"
  ],
  "Sternum": [
    "Esternón",
    "Sternum",
    "Brustbein"
  ],
  "Teeth & Gums": [
    "Dientes y encías",
    "Dents et gencives",
    "Zähne und Zahnfleisch"
  ],
  "Thigh Bone (Femur)": [
    "Hueso del muslo (fémur)",
    "Os de la cuisse (fémur)",
    "Oberschenkelknochen (Femur)"
  ],
  "Thoracic Spine": [
    "Columna torácica",
    "Rachis thoracique",
    "Brustwirbelsäule"
  ],
  "Upper Arm Bone": [
    "Húmero",
    "Humérus",
    "Oberarmknochen"
  ],
  "Thyroid gland": [
    "Glándula tiroides",
    "Glande thyroïde",
    "Schilddrüse"
  ],
  "Superior lobe of left lung": [
    "Lóbulo superior del pulmón izquierdo",
    "Lobe supérieur du poumon gauche",
    "Oberlappen der linken Lunge"
  ],
  "Inferior lobe of left lung": [
    "Lóbulo inferior del pulmón izquierdo",
    "Lobe inférieur du poumon gauche",
    "Unterlappen der linken Lunge"
  ],
  "Superior lobe of right lung": [
    "Lóbulo superior del pulmón derecho",
    "Lobe supérieur du poumon droit",
    "Oberlappen der rechten Lunge"
  ],
  "Middle lobe of right lung": [
    "Lóbulo medio del pulmón derecho",
    "Lobe moyen du poumon droit",
    "Mittellappen der rechten Lunge"
  ],
  "Inferior lobe of right lung": [
    "Lóbulo inferior del pulmón derecho",
    "Lobe inférieur du poumon droit",
    "Unterlappen der rechten Lunge"
  ]
}

export const messages = { ...baseMessages, ...clinicalMessages }
