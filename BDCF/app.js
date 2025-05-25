import { createApp } from 'vue';
import { renderFlowchart } from './flowchart.js';

const app = createApp({
    data() {
        return {
            currentSection: 'welcome',
            progress: 0,
            userProfile: null,
            showProfileExplanation: false,
            currentProfileExplanation: null,
            profiles: [
                {
                    id: 'alpha',
                    name: 'Alpha (Analphabétisme)',
                    description: 'Vous n\'avez jamais appris à lire et à écrire, quelle que soit la langue.',
                    color: '#e67c73',
                    icon: 'A'
                },
                {
                    id: 'post-alpha',
                    name: 'Post-Alpha',
                    description: 'Vous avez commencé à apprendre à lire et à écrire, mais vous n\'êtes pas encore à l\'aise.',
                    color: '#f6bf26',
                    icon: 'P'
                },
                {
                    id: 'fle',
                    name: 'FLE (Français Langue Étrangère)',
                    description: 'Vous avez appris à lire et à écrire dans une autre langue que le français.',
                    color: '#33b679',
                    icon: 'F'
                },
                {
                    id: 'illiteracy',
                    name: 'Illettrisme',
                    description: 'Vous avez été à l\'école en France, mais vous avez des difficultés importantes avec la lecture, l\'écriture ou le calcul.',
                    color: '#8e24aa',
                    icon: 'I'
                },
                {
                    id: 'refresher',
                    name: 'Remise à Niveau',
                    description: 'Vous avez des bases en français, mais vous souhaitez les renforcer.',
                    color: '#039be5',
                    icon: 'R'
                }
            ],
            userData: {
                age: null,
                gender: null,
                country: '',
                nativeLanguage: '',
                durationInFrance: '',
                hasSchooling: null,
                schoolingYears: '',
                schoolingLanguage: '',
                hasTakenFrenchCourses: null,
                frenchCourseTypes: [],
                oralLevel: null,
                readingLevel: null,
                writingLevel: null,
                readingDifficulties: [],
                writingDifficulties: [],
                mathDifficulties: null,
                mathSituationsDesc: '',
                selfPosition: null,
                confirmAlpha: null,
                motivations: [],
                otherMotivationsDesc: '',
                learningGoals: ''
            },
            countries: [
                'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola', 
                'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan', 'Bahamas', 
                'Bahreïn', 'Bangladesh', 'Barbade', 'Belgique', 'Belize', 'Bénin', 'Bhoutan', 'Biélorussie', 
                'Birmanie', 'Bolivie', 'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 
                'Burkina Faso', 'Burundi', 'Cambodge', 'Cameroun', 'Canada', 'Cap-Vert', 'Chili', 'Chine', 
                'Chypre', 'Colombo', 'Comores', 'Congo', 'Corée du Nord', 'Corée du Sud', 'Costa Rica', 
                'Côte d\'Ivoire', 'Croatie', 'Cuba', 'Danemark', 'Djibouti', 'Dominique', 'Égypte', 
                'Émirats arabes unis', 'Équateur', 'Érythrée', 'Espagne', 'Estonie', 'États-Unis', 'Éthiopie', 
                'Fidji', 'Finlande', 'France', 'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 'Grenade', 
                'Guatemala', 'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Guyana', 'Haïti', 'Honduras', 
                'Hongrie', 'Inde', 'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël', 'Italie', 
                'Jamaïque', 'Japon', 'Jordanie', 'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati', 'Koweït', 
                'Laos', 'Lesotho', 'Lettonie', 'Liban', 'Libéria', 'Libye', 'Liechtenstein', 'Lituanie', 
                'Luxembourg', 'Macédoine du Nord', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 
                'Malte', 'Maroc', 'Maurice', 'Mauritanie', 'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 
                'Mongolie', 'Monténégro', 'Mozambique', 'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger', 
                'Nigeria', 'Norvège', 'Nouvelle-Zélande', 'Oman', 'Ouganda', 'Ouzbékistan', 'Pakistan', 'Palaos', 
                'Palestine', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines', 
                'Pologne', 'Portugal', 'Qatar', 'République centrafricaine', 'République démocratique du Congo', 
                'République dominicaine', 'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda', 
                'Saint-Kitts-et-Nevis', 'Saint-Marin', 'Saint-Vincent-et-les-Grenadines', 'Sainte-Lucie', 'Salomon', 
                'Salvador', 'Samoa', 'São Tomé-et-Principe', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 
                'Singapour', 'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka', 'Suède', 
                'Suisse', 'Suriname', 'Syrie', 'Tadjikistan', 'Tanzanie', 'Tchad', 'Thaïlande', 'Timor oriental', 
                'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie', 'Turkménistan', 'Turquie', 'Tuvalu', 'Ukraine', 
                'Uruguay', 'Vanuatu', 'Vatican', 'Venezuela', 'Viêt Nam', 'Yémen', 'Zambie', 'Zimbabwe'
            ],
            languages: [
                'Allemand', 'Anglais', 'Arabe', 'Bengali', 'Bulgare', 'Chinois (Mandarin)', 'Coréen', 'Croate', 
                'Danois', 'Espagnol', 'Estonien', 'Finnois', 'Français', 'Grec', 'Hindi', 'Hongrois', 'Indonésien',
                'Italien', 'Japonais', 'Letton', 'Lituanien', 'Néerlandais', 'Norvégien', 'Ourdou', 'Persan', 
                'Polonais', 'Portugais', 'Roumain', 'Russe', 'Serbe', 'Slovaque', 'Slovène', 'Suédois', 'Swahili',
                'Tchèque', 'Thaï', 'Turc', 'Ukrainien', 'Vietnamien'
            ],
            illiteracyData: [
                { situation: 'En emploi', percentage: 51 },
                { situation: 'Au chômage', percentage: 10 },
                { situation: 'Formation', percentage: 13 },
                { situation: 'Retraite', percentage: 16 },
                { situation: 'Autres', percentage: 10 }
            ],
            showStatsSources: false,
            chartBarColor: '#ff9800', // Changed from violet to orange
            showFlowchartDescription: false,
            currentFlowchartNode: null,
        };
    },
    computed: {
        isGeneralInfoComplete() {
            return (
                this.userData.age && 
                this.userData.country && 
                this.userData.nativeLanguage && 
                this.userData.durationInFrance
            );
        },
        isSchoolingComplete() {
            if (this.userData.hasSchooling === 'no') {
                return true;
            }
            return (
                this.userData.hasSchooling === 'yes' && 
                this.userData.schoolingYears && 
                this.userData.schoolingLanguage
            );
        },
        isFleComplete() {
            return (
                this.userData.hasTakenFrenchCourses !== null &&
                this.userData.oralLevel &&
                this.userData.readingLevel &&
                this.userData.writingLevel
            );
        },
        isIlliteracyComplete() {
            return (
                this.userData.hasTakenFrenchCourses !== null &&
                this.userData.oralLevel &&
                this.userData.readingLevel &&
                this.userData.writingLevel &&
                this.userData.mathDifficulties !== null &&
                this.userData.selfPosition
            );
        },
        isMotivationsComplete() {
            return (
                this.userData.motivations.length > 0 &&
                (!this.userData.motivations.includes('other') || 
                 (this.userData.motivations.includes('other') && this.userData.otherMotivationsDesc))
            );
        }
    },
    methods: {
        startQuestionnaire() {
            this.currentSection = 'general-info';
            this.updateProgress();
        },
        
        scrollToSection(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        },
        
        nextSection() {
            if (this.currentSection === 'general-info') {
                this.currentSection = 'schooling';
            } else if (this.currentSection === 'schooling' && this.isSchoolingComplete) {
                this.processSchoolingAnswers();
            } else if (this.currentSection === 'alpha' && this.userData.confirmAlpha !== null) {
                this.processAlphaConfirmation();
            } else if ((this.currentSection === 'fle' && this.isFleComplete) || 
                       (this.currentSection === 'illiteracy' && this.isIlliteracyComplete)) {
                this.showMotivationsSection();
            } else if (this.currentSection === 'motivations' && this.isMotivationsComplete) {
                this.showResults();
            }
            this.updateProgress();
        },
        
        processSchoolingAnswers() {
            if (this.userData.hasSchooling === 'no') {
                this.currentSection = 'alpha';
            } else if (this.userData.schoolingLanguage === 'french') {
                this.currentSection = 'illiteracy';
            } else {
                this.currentSection = 'fle';
            }
            this.updateProgress();
        },
        
        processAlphaConfirmation() {
            if (this.userData.confirmAlpha === 'yes') {
                this.userProfile = 'alpha';
                this.showMotivationsSection();
            } else {
                this.currentSection = 'schooling';
                this.userData.hasSchooling = 'yes';
            }
        },
        
        showMotivationsSection() {
            this.currentSection = 'motivations';
            this.updateProgress();
        },
        
        showResults() {
            if (!this.userProfile) {
                this.determineUserProfile();
            }
            this.currentSection = 'results';
            this.progress = 100;
        },
        
        determineUserProfile() {
            if (this.userData.hasSchooling === 'no') {
                this.userProfile = 'alpha';
            } else if (this.userData.schoolingLanguage === 'french') {
                if (this.userData.selfPosition === 'illiteracy' || 
                    (this.userData.readingLevel === 'none' || this.userData.readingLevel === 'basic') || 
                    (this.userData.writingLevel === 'none' || this.userData.writingLevel === 'basic') ||
                    (this.userData.readingDifficulties.length >= 3) ||
                    (this.userData.writingDifficulties.length >= 3)) {
                    this.userProfile = 'illiteracy';
                } else {
                    this.userProfile = 'refresher';
                }
            } else {
                // FLE profile with sub-levels
                const levels = {
                    'a1.1': 0,
                    'a1': 1,
                    'a2': 2,
                    'b1': 3
                };
                
                const oralLevel = levels[this.userData.oralLevel] || 0;
                const readingLevel = levels[this.userData.readingLevel] || 0;
                const writingLevel = levels[this.userData.writingLevel] || 0;
                
                const avgLevel = (oralLevel + readingLevel + writingLevel) / 3;
                
                this.userProfile = 'fle';
                if (avgLevel < 1) {
                    this.userProfile += '-a1.1';
                } else if (avgLevel < 2) {
                    this.userProfile += '-a1';
                } else if (avgLevel < 3) {
                    this.userProfile += '-a2';
                } else {
                    this.userProfile += '-b1';
                }
            }
        },
        
        getProfileColor() {
            const baseProfile = this.userProfile.split('-')[0];
            const profileObj = this.profiles.find(p => p.id === baseProfile);
            return profileObj ? profileObj.color : '#4a86e8';
        },
        
        getProfileIcon() {
            const baseProfile = this.userProfile.split('-')[0];
            const profileObj = this.profiles.find(p => p.id === baseProfile);
            return profileObj ? profileObj.icon : 'F';
        },
        
        getProfileName() {
            const parts = this.userProfile.split('-');
            const baseProfile = parts[0];
            const level = parts[1];
            
            const profileObj = this.profiles.find(p => p.id === baseProfile);
            let name = profileObj ? profileObj.name : 'Profil inconnu';
            
            if (level) {
                if (baseProfile === 'fle') {
                    const levelMap = {
                        'a1.1': 'Niveau A1.1 (Débutant)',
                        'a1': 'Niveau A1 (Découverte)',
                        'a2': 'Niveau A2 (Intermédiaire)',
                        'b1': 'Niveau B1 (Avancé)'
                    };
                    name += ` - ${levelMap[level] || level}`;
                }
            }
            
            return name;
        },
        
        getProfileDescription() {
            const parts = this.userProfile.split('-');
            const baseProfile = parts[0];
            const level = parts[1];
            
            const profileObj = this.profiles.find(p => p.id === baseProfile);
            let description = profileObj ? profileObj.description : '';
            
            if (level && baseProfile === 'fle') {
                const levelDescriptions = {
                    'a1.1': 'Vous commencez tout juste à apprendre le français. Vous pouvez comprendre et utiliser des expressions familières et quotidiennes.',
                    'a1': 'Vous pouvez comprendre et utiliser des expressions familières et quotidiennes ainsi que des énoncés très simples.',
                    'a2': 'Vous pouvez communiquer lors de tâches simples et habituelles ne demandant qu\'un échange d\'informations simple.',
                    'b1': 'Vous pouvez vous débrouiller dans la plupart des situations rencontrées en voyage dans une région où la langue est parlée.'
                };
                description += ` ${levelDescriptions[level] || ''}`;
            }
            
            return description;
        },
        
        getRecommendations() {
            const parts = this.userProfile.split('-');
            const baseProfile = parts[0];
            const level = parts[1];
            
            const recommendations = {
                'alpha': 'Nous vous recommandons de suivre une formation d\'alphabétisation pour apprendre les bases de la lecture et de l\'écriture. Ces formations sont adaptées aux personnes qui n\'ont jamais été scolarisées.',
                'post-alpha': 'Nous vous recommandons de continuer votre apprentissage de la lecture et de l\'écriture avec une formation post-alphabétisation.',
                'fle-a1.1': 'Nous vous recommandons de suivre une formation FLE de niveau A1.1 (débutant) pour acquérir les premières bases du français.',
                'fle-a1': 'Nous vous recommandons de suivre une formation FLE de niveau A1 pour consolider les bases du français.',
                'fle-a2': 'Nous vous recommandons de suivre une formation FLE de niveau A2 pour approfondir vos connaissances en français.',
                'fle-b1': 'Nous vous recommandons de suivre une formation FLE de niveau B1 pour perfectionner votre français. Vous pourriez également envisager une formation professionnelle adaptée à votre projet.',
                'illiteracy': 'Nous vous recommandons de suivre une formation de lutte contre l\'illettrisme pour renforcer vos compétences en lecture, écriture et calcul.',
                'refresher': 'Nous vous recommandons de suivre une formation de remise à niveau en français pour consolider vos acquis.'
            };
            
            return recommendations[this.userProfile] || recommendations[baseProfile] || 'Nous vous recommandons de prendre contact avec un conseiller pour discuter des formations les plus adaptées à votre profil.';
        },
        
        formatGender(gender) {
            const genderMap = {
                'homme': 'Homme',
                'femme': 'Femme',
                'non-precise': 'Non précisé'
            };
            return genderMap[gender] || gender;
        },
        
        formatDuration(duration) {
            const durationMap = {
                'less-than-6-months': 'Moins de 6 mois',
                '6-months-to-1-year': '6 mois à 1 an',
                '1-to-2-years': '1 an à 2 ans',
                '2-to-5-years': '2 ans à 5 ans',
                'more-than-5-years': 'Plus de 5 ans',
                'less-than-2-years': 'Moins de 2 ans',
                '2-to-5-years': '2 à 5 ans',
                '5-to-10-years': '5 à 10 ans',
                'more-than-10-years': 'Plus de 10 ans'
            };
            return durationMap[duration] || duration;
        },
        
        goBack() {
            if (this.showProfileExplanation) {
                this.showProfileExplanation = false;
                this.currentProfileExplanation = null;
                // Scroll back to profiles section after closing explanation
                this.$nextTick(() => {
                    document.querySelector('.profiles').scrollIntoView({ behavior: 'smooth' });
                });
                return;
            }
            
            if (this.currentSection === 'general-info') {
                this.currentSection = 'welcome';
            } else if (this.currentSection === 'schooling') {
                this.currentSection = 'general-info';
            } else if (this.currentSection === 'alpha' || this.currentSection === 'fle' || this.currentSection === 'illiteracy') {
                this.currentSection = 'schooling';
            } else if (this.currentSection === 'motivations') {
                if (this.userData.hasSchooling === 'no') {
                    this.currentSection = 'alpha';
                } else if (this.userData.schoolingLanguage === 'french') {
                    this.currentSection = 'illiteracy';
                } else {
                    this.currentSection = 'fle';
                }
            }
            this.updateProgress();
        },
        
        updateProgress() {
            const sections = ['general-info', 'schooling', 'fle', 'illiteracy', 'alpha', 'motivations'];
            const currentIndex = sections.indexOf(this.currentSection);
            if (currentIndex >= 0) {
                this.progress = Math.round((currentIndex + 1) / sections.length * 100);
            } else {
                this.progress = 0;
            }
        },
        
        restartQuestionnaire() {
            this.currentSection = 'welcome';
            this.progress = 0;
            this.userProfile = null;
            this.showProfileExplanation = false;
            this.currentProfileExplanation = null;
            
            // Reset user data
            Object.keys(this.userData).forEach(key => {
                if (Array.isArray(this.userData[key])) {
                    this.userData[key] = [];
                } else {
                    this.userData[key] = null;
                }
            });
            
            // Specific fields that should be empty strings
            ['country', 'nativeLanguage', 'durationInFrance', 'schoolingYears', 'schoolingLanguage', 'mathSituationsDesc', 'otherMotivationsDesc', 'learningGoals'].forEach(key => {
                this.userData[key] = '';
            });
        },
        
        goHome() {
            if (confirm("Êtes-vous sûr de vouloir revenir à l'accueil ? Vos réponses ne seront pas enregistrées.")) {
                this.restartQuestionnaire();
            }
        },
        
        showExplanation(profileId) {
            this.showProfileExplanation = true;
            this.currentProfileExplanation = profileId;
            // Wait for DOM update then scroll to explanation section
            this.$nextTick(() => {
                document.getElementById('profile-explanation').scrollIntoView({ behavior: 'smooth' });
            });
        },
        
        renderIlliteracyChart() {
            if (this.currentSection !== 'welcome') return;
            
            setTimeout(() => {
                const chartContainer = document.getElementById('illiteracy-chart');
                if (!chartContainer) return;
                
                // Clear previous chart if any
                chartContainer.innerHTML = '';
                
                // Create tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'chart-tooltip';
                chartContainer.appendChild(tooltip);
                
                // Chart dimensions
                const width = chartContainer.clientWidth;
                const height = chartContainer.clientHeight;
                const padding = { top: 40, right: 20, bottom: 60, left: 60 };
                const barPadding = 40;
                
                // Create SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', width);
                svg.setAttribute('height', height);
                chartContainer.appendChild(svg);
                
                // Calculate bar width
                const barWidth = (width - padding.left - padding.right) / this.illiteracyData.length - barPadding;
                
                // Y scale
                const yScale = (height - padding.top - padding.bottom) / 100;
                
                // Draw axes
                const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                xAxis.setAttribute('x1', padding.left);
                xAxis.setAttribute('y1', height - padding.bottom);
                xAxis.setAttribute('x2', width - padding.right);
                xAxis.setAttribute('y2', height - padding.bottom);
                xAxis.setAttribute('stroke', 'rgba(204, 204, 204, 0.5)');
                xAxis.setAttribute('stroke-width', 1);
                svg.appendChild(xAxis);
                
                const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                yAxis.setAttribute('x1', padding.left);
                yAxis.setAttribute('y1', padding.top);
                yAxis.setAttribute('x2', padding.left);
                yAxis.setAttribute('y2', height - padding.bottom);
                yAxis.setAttribute('stroke', 'rgba(204, 204, 204, 0.5)');
                yAxis.setAttribute('stroke-width', 1);
                svg.appendChild(yAxis);
                
                // Y axis ticks and labels
                [0, 25, 50, 75, 100].forEach(tick => {
                    const y = height - padding.bottom - tick * yScale;
                    
                    // Tick line
                    const tickLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    tickLine.setAttribute('x1', padding.left - 5);
                    tickLine.setAttribute('y1', y);
                    tickLine.setAttribute('x2', padding.left);
                    tickLine.setAttribute('y2', y);
                    tickLine.setAttribute('stroke', 'rgba(204, 204, 204, 0.5)');
                    tickLine.setAttribute('stroke-width', 1);
                    svg.appendChild(tickLine);
                    
                    // Tick label
                    const tickLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    tickLabel.setAttribute('x', padding.left - 10);
                    tickLabel.setAttribute('y', y + 5);
                    tickLabel.setAttribute('text-anchor', 'end');
                    tickLabel.setAttribute('font-size', '12px');
                    tickLabel.setAttribute('fill', 'var(--chart-text)');
                    tickLabel.textContent = tick + '%';
                    svg.appendChild(tickLabel);
                });
                
                // Draw bars and labels
                this.illiteracyData.forEach((item, index) => {
                    const barHeight = item.percentage * yScale;
                    const x = padding.left + index * (barWidth + barPadding) + barPadding / 2;
                    const y = height - padding.bottom - barHeight;
                    
                    // Bar
                    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bar.setAttribute('x', x);
                    bar.setAttribute('y', y);
                    bar.setAttribute('width', barWidth);
                    bar.setAttribute('height', barHeight);
                    bar.setAttribute('fill', 'var(--chart-bar-color)');
                    bar.setAttribute('rx', 8); // Rounded corners
                    bar.setAttribute('filter', 'drop-shadow(0px 3px 3px rgba(0,0,0,0.1))');
                    bar.setAttribute('data-percentage', item.percentage);
                    bar.setAttribute('data-situation', item.situation);
                    svg.appendChild(bar);
                    
                    // Add hover effects
                    bar.addEventListener('mouseover', (e) => {
                        bar.setAttribute('fill', 'var(--primary-color)');
                        bar.setAttribute('filter', 'drop-shadow(0px 6px 8px rgba(0,0,0,0.2))');
                        bar.setAttribute('transform', 'translate(0, -2)');
                        tooltip.textContent = `${item.situation}: ${item.percentage}%`;
                        tooltip.style.opacity = 1;
                        
                        // Position tooltip
                        const rect = bar.getBoundingClientRect();
                        const containerRect = chartContainer.getBoundingClientRect();
                        tooltip.style.left = (rect.left - containerRect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                        tooltip.style.top = (rect.top - containerRect.top - tooltip.offsetHeight - 10) + 'px';
                    });
                    
                    bar.addEventListener('mouseout', () => {
                        bar.setAttribute('fill', 'var(--chart-bar-color)');
                        bar.setAttribute('filter', 'drop-shadow(0px 3px 3px rgba(0,0,0,0.1))');
                        bar.setAttribute('transform', 'translate(0, 0)');
                        tooltip.style.opacity = 0;
                    });
                    
                    // X-axis label
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', x + barWidth / 2);
                    label.setAttribute('y', height - padding.bottom + 20);
                    label.setAttribute('text-anchor', 'middle');
                    label.setAttribute('font-size', '12px');
                    label.setAttribute('fill', 'var(--chart-text)');
                    label.textContent = item.situation;
                    svg.appendChild(label);
                });
                
                // Y-axis label
                const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                yLabel.setAttribute('x', -height / 2);
                yLabel.setAttribute('y', 15);
                yLabel.setAttribute('transform', 'rotate(-90)');
                yLabel.setAttribute('text-anchor', 'middle');
                yLabel.setAttribute('font-size', '12px');
                yLabel.setAttribute('fill', 'var(--chart-text)');
                yLabel.textContent = 'Pourcentage';
                svg.appendChild(yLabel);
            }, 100);
        },
        
        renderFlowchart() {
            if (this.currentSection !== 'welcome' || this.showProfileExplanation) return;
            
            setTimeout(() => {
                renderFlowchart();
            }, 200);
        },
        
        toggleStatsSources() {
            this.showStatsSources = !this.showStatsSources;
        },
    },
    mounted() {
        this.renderIlliteracyChart();
        this.renderFlowchart();
    },
    updated() {
        this.renderIlliteracyChart();
        this.renderFlowchart();
    }
});

app.mount('#app');