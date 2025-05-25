import { euCountries, formerMembers, candidateCountries, nonEUCountries, euPresidency, institutions, keyEvents } from './data.js';
import * as d3 from 'd3';

// Configuration des couleurs
const colors = {
    eu: "#99CCFF",       // Light blue for EU members
    cee: "#FF9900",      // Orange for pre-1992 CEE
    candidate: "#90EE90", // Light green for candidate countries
    nonEU: "#CCCCCC",    // Light gray for non-EU countries
    schengen: "#FFCC00", // Yellow for Schengen area
    euro: "#00CC00",     // Green for Euro zone
    institutions: "#FF9900", // Orange for institutions
    presidency: "#FFCC00"   // Yellow for presidency
};

// État global
let currentYear = 2023;
let mapData = {};
let svg, projection, path;
let tooltip;

// Définir les groupes d'affichage
const layers = {
    eu: true,
    candidates: false,
    nonEU: false,
    schengen: false,
    euro: false,
    institutions: false,
    presidency: false
};

// Initialisation
document.addEventListener('DOMContentLoaded', async function() {
    // Créer la tooltip
    tooltip = d3.select('body').append('div')
        .attr('class', 'country-tooltip')
        .style('opacity', 0);
    
    // Charger les données GeoJSON de l'Europe
    const europeData = await loadEuropeMap();
    initMap(europeData);
    
    // Initialiser les contrôles
    initControls();
    
    // Ajouter la fonctionnalité de zoom par molette
    initZoom();
    
    // Afficher la carte pour l'année actuelle
    updateMap(currentYear);
});

// Chargement du GeoJSON simplifié de l'Europe
async function loadEuropeMap() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson');
        return await response.json();
    } catch (error) {
        console.error("Erreur lors du chargement de la carte:", error);
        return null;
    }
}

// Initialiser la carte
function initMap(geoData) {
    if (!geoData) return;
    
    // Stocker les données pour une utilisation ultérieure
    mapData = geoData;
    
    const mapContainer = document.getElementById('europe-map');
    const width = mapContainer.clientWidth;
    const height = mapContainer.clientHeight;
    
    // Créer l'élément SVG
    svg = d3.select('#europe-map')
        .attr('width', width)
        .attr('height', height);
    
    // Créer des motifs pour l'euro et Schengen
    createPatterns(svg);
    
    // Configurer la projection
    projection = d3.geoMercator()
        .center([10, 55])
        .scale(width / 1.5)
        .translate([width / 2, height / 2]);
    
    path = d3.geoPath().projection(projection);

    // Ajouter un groupe pour tout le contenu
    const g = svg.append('g').attr('id', 'map-group');
}

// Créer des motifs pour les zones euro et Schengen
function createPatterns(svg) {
    const defs = svg.append('defs');
    
    // Motif pour la zone euro
    defs.append('pattern')
        .attr('id', 'euro-pattern')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 10)
        .attr('height', 10)
        .attr('class', 'euro-pattern')
        .append('path')
        .attr('d', 'M0,0 L10,10')
        .attr('stroke', colors.euro)
        .attr('stroke-width', 2);
    
    // Motif pour l'espace Schengen
    defs.append('pattern')
        .attr('id', 'schengen-pattern')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 10)
        .attr('height', 10)
        .attr('class', 'schengen-pattern')
        .append('path')
        .attr('d', 'M10,0 L0,10')
        .attr('stroke', colors.schengen)
        .attr('stroke-width', 2);
}

// Mise à jour de la carte selon l'année sélectionnée
function updateMap(year) {
    if (!mapData || !mapData.features) return;
    
    // Vider la carte
    svg.select('#map-group').remove();
    
    // Créer un groupe pour tout le contenu
    const g = svg.append('g').attr('id', 'map-group');
    
    // Groupe principal pour les pays
    const countriesGroup = g.append('g').attr('class', 'countries');
    
    // Dessiner les pays
    mapData.features.forEach(feature => {
        const countryCode = feature.properties.ISO2;
        let countryData = findCountryByCode(countryCode);
        
        if (countryData) {
            const status = getCountryStatusAtYear(countryData, year);
            let fillColor = colors.nonEU;
            let shouldShow = false;
            
            // Déterminer la couleur et la visibilité
            if (status === 'eu' && layers.eu) {
                fillColor = colors.eu;
                shouldShow = true;
            } else if (status === 'cee' && layers.eu) {
                fillColor = colors.cee;
                shouldShow = true;
            } else if (status === 'candidate' && layers.candidates) {
                fillColor = colors.candidate;
                shouldShow = true;
            } else if (status === 'non-eu' && layers.nonEU) {
                shouldShow = true;
            }
            
            if (shouldShow) {
                // Dessiner le pays
                const country = countriesGroup.append('path')
                    .datum(feature)
                    .attr('class', 'country')
                    .attr('d', path)
                    .attr('fill', fillColor)
                    .on('mouseover', (event) => {
                        d3.select(event.currentTarget)
                            .attr('stroke-width', 1)
                            .attr('fill', status === 'eu' ? '#4169E1' : fillColor); // Royal blue on hover for EU countries
                        displayTooltip(event, countryData);
                    })
                    .on('mouseout', () => {
                        d3.select(event.currentTarget)
                            .attr('stroke-width', 1)
                            .attr('fill', fillColor);
                        tooltip.style('opacity', 0);
                    })
                    .on('click', () => displayCountryInfo(countryData));
                
                // Ajouter des motifs pour l'euro et Schengen si nécessaire
                if (countryData.euro && year >= 1999 && layers.euro) {
                    countriesGroup.append('path')
                        .datum(feature)
                        .attr('d', path)
                        .attr('fill', 'url(#euro-pattern)')
                        .attr('stroke', 'none');
                }
                
                if (countryData.schengen && year >= 1995 && layers.schengen) {
                    countriesGroup.append('path')
                        .datum(feature)
                        .attr('d', path)
                        .attr('fill', 'url(#schengen-pattern)')
                        .attr('stroke', 'none');
                }
                
                // Ajouter un marqueur pour la capitale
                if (countryData.coords && (status === 'eu' || status === 'cee')) {
                    const [lat, lng] = countryData.coords;
                    const projectedCoords = projection([lng, lat]);
                    
                    if (projectedCoords) {
                        g.append('circle')
                            .attr('class', 'capital-marker')
                            .attr('cx', projectedCoords[0])
                            .attr('cy', projectedCoords[1])
                            .attr('r', 4)
                            .on('mouseover', (event) => {
                                displayTooltip(event, { name: countryData.capital, description: `Capitale de ${countryData.name}` });
                            })
                            .on('mouseout', () => {
                                tooltip.style('opacity', 0);
                            });
                    }
                }
                
                // Ajouter un marqueur pour la présidence si applicable
                if (hasPresidency(countryData, year) && layers.presidency) {
                    const [lat, lng] = countryData.coords;
                    const projectedCoords = projection([lng, lat]);
                    
                    if (projectedCoords) {
                        g.append('circle')
                            .attr('class', 'presidency-marker')
                            .attr('cx', projectedCoords[0])
                            .attr('cy', projectedCoords[1] - 10) // Au-dessus de la capitale
                            .attr('r', 6)
                            .on('mouseover', (event) => {
                                displayTooltip(event, { name: "Présidence de l'UE", description: `${countryData.name} préside le Conseil de l'UE` });
                            })
                            .on('mouseout', () => {
                                tooltip.style('opacity', 0);
                            });
                    }
                }
            }
        }
    });
    
    // Afficher les institutions
    if (layers.institutions) {
        institutions.forEach(institution => {
            if (year >= institution.year) {
                const [lat, lng] = institution.coords;
                const projectedCoords = projection([lng, lat]);
                
                if (projectedCoords) {
                    g.append('circle')
                        .attr('class', 'institution-marker')
                        .attr('cx', projectedCoords[0])
                        .attr('cy', projectedCoords[1])
                        .attr('r', 5)
                        .attr('fill', colors.institutions) 
                        .on('mouseover', (event) => {
                            displayTooltip(event, institution);
                        })
                        .on('mouseout', () => {
                            tooltip.style('opacity', 0);
                        });
                }
            }
        });
    }
    
    // Mettre à jour les filtres et informations
    updateFiltersDisplay();
    updateKeyEvents(year);
}

// Afficher la tooltip
function displayTooltip(event, data) {
    tooltip.transition()
        .duration(200)
        .style('opacity', .9);
    
    let content = `<strong>${data.name}</strong>`;
    if (data.city) content += `<br>Ville: ${data.city}`;
    if (data.description) content += `<br>${data.description}`;
    
    tooltip.html(content)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 20) + 'px');
}

// Rechercher un pays par son code
function findCountryByCode(code) {
    // Chercher dans tous les tableaux de pays
    return [...euCountries, ...formerMembers, ...candidateCountries, ...nonEUCountries]
        .find(country => country.code === code);
}

// Déterminer le statut d'un pays à une année donnée
function getCountryStatusAtYear(country, year) {
    if (country.joinYear && country.joinYear <= year) {
        if (country.leaveYear && country.leaveYear <= year) {
            return "former";
        }
        if (year < 1992) {
            return "cee";
        }
        return "eu";
    }
    if (country.candidateYear && country.candidateYear <= year) {
        return "candidate";
    }
    return "non-eu";
}

// Vérifier si un pays a la présidence à une année donnée
function hasPresidency(country, year) {
    const presidencyItem = euPresidency.find(p => {
        const startDate = new Date(p.startDate);
        const endDate = new Date(p.endDate);
        const targetDate = new Date(year, 6, 1); // 1er juillet de l'année
        return p.country === country.name && targetDate >= startDate && targetDate <= endDate;
    });
    
    return Boolean(presidencyItem);
}

// Afficher les informations d'un pays
function displayCountryInfo(country) {
    let infoHtml = `<h4>${country.name}</h4>`;
    
    if (country.capital) {
        infoHtml += `<p><strong>Capitale:</strong> ${country.capital}</p>`;
    }
    
    if (country.joinYear) {
        infoHtml += `<p><strong>Adhésion à l'UE:</strong> ${country.joinYear}</p>`;
    } else if (country.candidateYear) {
        infoHtml += `<p><strong>Statut:</strong> ${country.status} depuis ${country.candidateYear}</p>`;
    } else if (country.status) {
        infoHtml += `<p><strong>Statut:</strong> ${country.status}</p>`;
    }
    
    if (country.leaveYear) {
        infoHtml += `<p><strong>Sortie de l'UE:</strong> ${country.leaveYear}</p>`;
    }
    
    if (country.euro !== undefined) {
        infoHtml += `<p><strong>Zone Euro:</strong> ${country.euro ? 'Oui' : 'Non'}</p>`;
    }
    
    if (country.schengen !== undefined) {
        infoHtml += `<p><strong>Espace Schengen:</strong> ${country.schengen ? 'Oui' : 'Non'}</p>`;
    }
    
    if (country.institutions && country.institutions.length > 0) {
        infoHtml += `<p><strong>Institutions européennes:</strong> ${country.institutions.join(', ')}</p>`;
    }
    
    if (country.presidency && country.presidency.length > 0) {
        infoHtml += `<p><strong>Présidences du Conseil:</strong> ${country.presidency.join(', ')}</p>`;
    }
    
    document.getElementById('country-info').innerHTML = infoHtml;
}

// Mettre à jour l'affichage des filtres
function updateFiltersDisplay() {
    // Mettre à jour l'année affichée
    document.getElementById('current-year').textContent = currentYear;
    
    // Statut CEE/UE
    document.getElementById('filter-cee').checked = currentYear < 1992;
    document.getElementById('filter-eu-post-1992').checked = currentYear >= 1992;
}

// Afficher les événements clés pour une année donnée
function updateKeyEvents(year) {
    const relevantEvents = keyEvents.filter(event => event.year <= year);
    
    if (relevantEvents.length > 0) {
        const latestEvent = relevantEvents[relevantEvents.length - 1];
        console.log(`Événement clé en ${latestEvent.year}: ${latestEvent.event}`);
    }
}

// Initialiser les contrôles
function initControls() {
    // Curseur temporel
    document.getElementById('year-slider').addEventListener('input', function() {
        currentYear = parseInt(this.value);
        updateMap(currentYear);
    });
    
    // Filtres de statut
    document.getElementById('filter-eu').addEventListener('change', function() {
        layers.eu = this.checked;
        updateMap(currentYear);
    });
    
    document.getElementById('filter-candidates').addEventListener('change', function() {
        layers.candidates = this.checked;
        updateMap(currentYear);
    });
    
    document.getElementById('filter-non-eu').addEventListener('change', function() {
        layers.nonEU = this.checked;
        updateMap(currentYear);
    });
    
    // Filtres de zones
    document.getElementById('filter-schengen').addEventListener('change', function() {
        layers.schengen = this.checked;
        updateMap(currentYear);
    });
    
    document.getElementById('filter-euro').addEventListener('change', function() {
        layers.euro = this.checked;
        updateMap(currentYear);
    });
    
    // Filtres d'institutions
    document.getElementById('filter-institutions').addEventListener('change', function() {
        layers.institutions = this.checked;
        updateMap(currentYear);
    });
    
    document.getElementById('filter-presidency').addEventListener('change', function() {
        layers.presidency = this.checked;
        updateMap(currentYear);
    });
    
    // Filtres historiques
    document.getElementById('filter-cee').addEventListener('change', function() {
        if (this.checked) {
            currentYear = 1975;
            document.getElementById('year-slider').value = currentYear;
            updateMap(currentYear);
        }
    });
    
    document.getElementById('filter-eu-post-1992').addEventListener('change', function() {
        if (this.checked) {
            currentYear = 2023;
            document.getElementById('year-slider').value = currentYear;
            updateMap(currentYear);
        }
    });
}

// Initialiser la fonctionnalité de zoom
function initZoom() {
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            svg.select('#map-group').attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Activer le zoom par molette de souris
    svg.on('wheel', function(event) {
        event.preventDefault();
        const delta = event.deltaY;
        const scale = delta > 0 ? 0.9 : 1.1; // Zoom out si deltaY > 0, zoom in sinon
        
        const mousePos = d3.pointer(event);
        const transform = d3.zoomTransform(svg.node());
        const newTransform = transform.translate(
            (mousePos[0] - transform.x) * (1 - scale),
            (mousePos[1] - transform.y) * (1 - scale)
        ).scale(scale * transform.k);
        
        zoom.transform(svg, newTransform);
    });
}