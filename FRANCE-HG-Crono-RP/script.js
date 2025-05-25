import * as d3 from 'd3';

// Données pour les deux périodes
const periodes = {
    periode1: [
        { 
            regime: "Monarchie constitutionnelle", 
            debut: 1789, 
            fin: 1791,
            couleur: "var(--monarchie-color)",
            evenements: [
                "Révolution française (1789)",
                "Prise de la Bastille (14 juillet 1789)",
                "Déclaration des Droits de l'Homme et du Citoyen (26 août 1789)"
            ],
            personnages: ["Louis XVI"]
        },
        { 
            regime: "Première République", 
            debut: 1792, 
            fin: 1804, 
            couleur: "var(--republique-color)",
            evenements: [
                "Proclamation de la République (21 septembre 1792)",
                "Exécution de Louis XVI (21 janvier 1793)",
                "Coup d'État du 18 Brumaire par Napoléon Bonaparte (9 novembre 1799)"
            ],
            personnages: ["Robespierre", "Napoléon Bonaparte"]
        },
        { 
            regime: "Premier Empire", 
            debut: 1804, 
            fin: 1814, 
            couleur: "var(--empire-color)",
            evenements: [
                "Sacre de Napoléon Ier comme empereur (2 décembre 1804)",
                "Conquêtes militaires en Europe",
                "Défaite à Waterloo (1815)"
            ],
            personnages: ["Napoléon Ier"]
        },
        { 
            regime: "Restauration", 
            debut: 1815, 
            fin: 1830, 
            couleur: "var(--monarchie-color)",
            evenements: [
                "Retour des Bourbons avec Louis XVIII",
                "Révolution des Trois Glorieuses (1830) qui renverse Charles X"
            ],
            personnages: ["Louis XVIII", "Charles X"]
        },
        { 
            regime: "Monarchie de Juillet", 
            debut: 1830, 
            fin: 1848, 
            couleur: "var(--monarchie-color)",
            evenements: [
                "Révolution de 1830",
                "Règne de Louis-Philippe Ier, roi des Français"
            ],
            personnages: ["Louis-Philippe Ier"]
        },
        { 
            regime: "Deuxième République", 
            debut: 1848, 
            fin: 1852, 
            couleur: "var(--republique-color)",
            evenements: [
                "Révolution de février 1848",
                "Proclamation du suffrage universel masculin",
                "Élection de Louis-Napoléon Bonaparte comme président"
            ],
            personnages: ["Louis-Napoléon Bonaparte"]
        },
        { 
            regime: "Second Empire", 
            debut: 1852, 
            fin: 1870, 
            couleur: "var(--empire-color)",
            evenements: [
                "Coup d'État de Louis-Napoléon Bonaparte (1851)",
                "Proclamation de l'Empire (1852)",
                "Guerre franco-prussienne et chute de l'Empire (1870)"
            ],
            personnages: ["Napoléon III"]
        },
        { 
            regime: "Troisième République", 
            debut: 1870, 
            fin: 1940, 
            couleur: "var(--republique-color)",
            evenements: [
                "Proclamation de la République après la défaite face à la Prusse",
                "Affaire Dreyfus",
                "Début de la Seconde Guerre mondiale et effondrement en 1940"
            ],
            personnages: ["Léon Gambetta", "Jules Ferry"]
        }
    ],
    periode2: [
        { 
            regime: "Régime de Vichy", 
            debut: 1940, 
            fin: 1944, 
            couleur: "var(--vichy-color)",
            evenements: [
                "Signature de l'armistice entre la France et l'Allemagne (22 juin 1940)",
                "Vote des pleins pouvoirs à Pétain (10 juillet 1940)",
                "Rafle du Vel d'Hiv, collaboration accrue avec l'Allemagne (1942)"
            ],
            personnages: ["Philippe Pétain", "Pierre Laval"]
        },
        { 
            regime: "Forces Françaises Libres", 
            debut: 1940, 
            fin: 1944, 
            couleur: "var(--provisoire-color)",
            evenements: [
                "Appel de Charles de Gaulle depuis Londres (18 juin 1940)",
                "Formation des Forces françaises libres"
            ],
            personnages: ["Charles de Gaulle"]
        },
        { 
            regime: "Gouvernement Provisoire", 
            debut: 1944, 
            fin: 1946, 
            couleur: "var(--provisoire-color)",
            evenements: [
                "Libération de Paris (25 août 1944)",
                "Formation du Gouvernement provisoire dirigé par De Gaulle (9 septembre 1944)",
                "Démission de De Gaulle (20 janvier 1946)"
            ],
            personnages: ["Charles de Gaulle"]
        },
        { 
            regime: "Quatrième République", 
            debut: 1946, 
            fin: 1958, 
            couleur: "var(--republique-color)",
            evenements: [
                "Adoption de la Constitution de la IVe République (13 octobre 1946)",
                "Création du Rassemblement du Peuple Français (RPF) par De Gaulle (1947)",
                "Début de la guerre d'Algérie (1er novembre 1954)",
                "Crise d'Alger et appel à De Gaulle (13 mai 1958)"
            ],
            personnages: ["Félix Gouin", "Georges Bidault", "Charles de Gaulle"]
        },
        { 
            regime: "Cinquième République", 
            debut: 1958, 
            fin: 1962, 
            couleur: "var(--republique-color)",
            evenements: [
                "De Gaulle devient président du Conseil avec les pleins pouvoirs (1er juin 1958)",
                "Référendum approuvant la Constitution de la Ve République (28 septembre 1958)",
                "Entrée en vigueur officielle de la Ve République (8 janvier 1959)",
                "Accords d'Évian, fin de la guerre d'Algérie (22 mars 1962)"
            ],
            personnages: ["Charles de Gaulle"]
        }
    ]
};

let currentPeriode = 'periode1';
let svg, xScale, xAxis, gX, zoom;
let currentData = periodes[currentPeriode];

// Initialiser la frise chronologique
function initTimeline() {
    const container = d3.select('#timeline');
    const width = container.node().getBoundingClientRect().width;
    const height = container.node().getBoundingClientRect().height;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    
    // Nettoyer le conteneur
    container.selectAll("*").remove();
    
    // Créer le SVG
    svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Données de la période actuelle
    currentData = periodes[currentPeriode];
    
    // Déterminer l'étendue temporelle
    const minYear = d3.min(currentData, d => d.debut);
    const maxYear = d3.max(currentData, d => d.fin);
    
    // Créer l'échelle X
    xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([margin.left, width - margin.right]);
    
    // Créer l'axe X
    xAxis = d3.axisBottom(xScale)
        .tickFormat(d => d)
        .ticks(10);
    
    // Ajouter l'axe X
    gX = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);
    
    // Ajouter le titre de l'axe
    svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .text('Années');
    
    // Ajouter les rectangles pour chaque période
    const rectHeight = 50;
    const yPosition = height - margin.bottom - rectHeight - 20;
    
    svg.selectAll('rect')
        .data(currentData)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.debut))
        .attr('y', yPosition)
        .attr('width', d => xScale(d.fin) - xScale(d.debut))
        .attr('height', rectHeight)
        .attr('fill', d => d.couleur)
        .attr('stroke', '#333')
        .attr('stroke-width', 1)
        .attr('data-regime', d => d.regime)
        .on('click', handleRegimeClick);
    
    // Ajouter les étiquettes
    svg.selectAll('.regime-label')
        .data(currentData)
        .enter()
        .append('text')
        .attr('class', 'regime-label')
        .attr('x', d => xScale(d.debut) + (xScale(d.fin) - xScale(d.debut)) / 2)
        .attr('y', (d, i) => i % 2 === 0 ? 
            yPosition - 10 : // Au-dessus pour les éléments pairs
            yPosition + rectHeight + 20) // En-dessous pour les éléments impairs
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#000')
        .text(d => d.regime)
        .each(function(d) {
            const textWidth = this.getComputedTextLength();
            const rectWidth = xScale(d.fin) - xScale(d.debut);
            if (textWidth > rectWidth - 5) {
                // Au lieu de cacher, on tronque le texte
                const text = d.regime;
                const ratio = (rectWidth - 10) / textWidth;
                const newLength = Math.floor(text.length * ratio);
                if (newLength > 3) {
                    d3.select(this).text(text.substring(0, newLength) + '...');
                } else {
                    d3.select(this).style('display', 'none');
                }
            }
        });
    
    // Configuration du zoom
    zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([[margin.left, 0], [width - margin.right, height]])
        .on('zoom', zoomed);
    
    svg.call(zoom);
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', debounce(() => {
        initTimeline();
    }, 250));
}

// Fonction pour gérer le zoom
function zoomed(event) {
    const newXScale = event.transform.rescaleX(xScale);
    gX.call(xAxis.scale(newXScale));
    
    svg.selectAll('rect')
        .attr('x', d => newXScale(d.debut))
        .attr('width', d => newXScale(d.fin) - newXScale(d.debut));
    
    svg.selectAll('.regime-label')
        .attr('x', d => newXScale(d.debut) + (newXScale(d.fin) - newXScale(d.debut)) / 2)
        .each(function(d) {
            const textWidth = this.getComputedTextLength();
            const rectWidth = newXScale(d.fin) - newXScale(d.debut);
            
            if (textWidth > rectWidth - 5) {
                const text = d.regime;
                const ratio = (rectWidth - 10) / textWidth;
                const newLength = Math.floor(text.length * ratio);
                if (newLength > 3) {
                    d3.select(this).text(text.substring(0, newLength) + '...')
                                   .style('display', 'block');
                } else {
                    d3.select(this).style('display', 'none');
                }
            } else {
                d3.select(this).text(d.regime).style('display', 'block');
            }
        });
}

// Fonction pour gérer le clic sur un régime
function handleRegimeClick(event, d) {
    // Arrêter la propagation pour éviter les conflits avec le zoom
    event.stopPropagation();
    
    const detailsContent = document.getElementById('details-content');
    const regimeTitle = document.getElementById('regime-title');
    const regimePeriode = document.getElementById('regime-periode');
    const evenementsList = document.getElementById('evenements-list');
    const personnagesList = document.getElementById('personnages-list');
    
    // Mettre à jour les détails
    regimeTitle.textContent = d.regime;
    regimePeriode.textContent = `${d.debut} - ${d.fin}`;
    
    // Événements
    evenementsList.innerHTML = '';
    d.evenements.forEach(evt => {
        const li = document.createElement('li');
        li.textContent = evt;
        evenementsList.appendChild(li);
    });
    
    // Personnages
    personnagesList.innerHTML = '';
    d.personnages.forEach(pers => {
        const li = document.createElement('li');
        li.textContent = pers;
        personnagesList.appendChild(li);
    });
    
    // Afficher le contenu
    detailsContent.classList.remove('hidden');
    
    // Mise en évidence du régime sélectionné
    svg.selectAll('rect')
        .attr('stroke-width', 1)
        .attr('stroke', '#333');
    
    d3.select(event.currentTarget)
        .attr('stroke-width', 3)
        .attr('stroke', 'var(--accent-color)');
}

// Fonction pour changer de période
function changerPeriode(periode) {
    currentPeriode = periode;
    initTimeline();
    
    // Réinitialiser le panneau de détails
    const detailsContent = document.getElementById('details-content');
    detailsContent.classList.add('hidden');
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.periode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(periode).classList.add('active');
}

// Fonction pour débouncer les événements (redimensionnement)
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la frise chronologique
    initTimeline();
    
    // Ajouter les écouteurs d'événements pour les boutons de période
    document.getElementById('periode1').addEventListener('click', () => changerPeriode('periode1'));
    document.getElementById('periode2').addEventListener('click', () => changerPeriode('periode2'));
    
    // Ajouter les écouteurs d'événements pour les contrôles de zoom
    document.getElementById('zoom-in').addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    });
    
    document.getElementById('reset-zoom').addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });
});