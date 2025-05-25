export function renderFlowchart() {
  const flowchartContainer = document.getElementById('process-flowchart');
  if (!flowchartContainer) return;

  // Clear previous flowchart
  flowchartContainer.innerHTML = '';

  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '600px');
  svg.setAttribute('viewBox', '0 0 1200 600');
  flowchartContainer.appendChild(svg);

  // Define nodes
  const nodes = [
    { id: 'welcome', text: 'Accueil', x: 100, y: 100, width: 150, height: 60, color: '#4a86e8', textColor: 'white', 
      description: 'Page d\'accueil et présentation du questionnaire' },
    { id: 'general-info', text: 'Informations Générales', x: 350, y: 100, width: 200, height: 60, color: '#f0f8ff', textColor: '#333',
      description: 'Informations sur votre âge, pays d\'origine, et langue maternelle' },
    { id: 'schooling', text: 'Scolarisation', x: 650, y: 100, width: 150, height: 60, color: '#e6f4fa', textColor: '#333',
      description: 'Questions sur votre parcours scolaire' },
    
    { id: 'alpha', text: 'Alpha', x: 650, y: 220, width: 150, height: 60, color: '#e67c73', textColor: 'white',
      description: 'Profil pour les personnes n\'ayant jamais appris à lire et écrire' },
    { id: 'fle', text: 'FLE', x: 450, y: 220, width: 150, height: 60, color: '#33b679', textColor: 'white',
      description: 'Français Langue Étrangère : pour les personnes ayant appris à lire et écrire dans une autre langue' },
    { id: 'illiteracy', text: 'Illettrisme', x: 850, y: 220, width: 150, height: 60, color: '#8e24aa', textColor: 'white',
      description: 'Pour les personnes ayant été scolarisées en français mais ayant des difficultés importantes' },
    
    { id: 'fle-a1', text: 'FLE A1.1', x: 350, y: 340, width: 120, height: 60, color: '#33b679', textColor: 'white', 
      description: 'Niveau débutant - premiers pas en français' },
    { id: 'fle-a2', text: 'FLE A1-A2', x: 480, y: 340, width: 120, height: 60, color: '#33b679', textColor: 'white',
      description: 'Niveau élémentaire - bases de communication' },
    { id: 'fle-b1', text: 'FLE B1+', x: 610, y: 340, width: 120, height: 60, color: '#33b679', textColor: 'white',
      description: 'Niveau intermédiaire à avancé' },
    
    { id: 'illiteracy-profile', text: 'Illettrisme', x: 780, y: 340, width: 120, height: 60, color: '#8e24aa', textColor: 'white',
      description: 'Formation pour renforcer les compétences de base' },
    { id: 'refresher', text: 'Remise à niveau', x: 910, y: 340, width: 120, height: 60, color: '#039be5', textColor: 'white',
      description: 'Pour consolider les acquis en français' },
    
    { id: 'motivations', text: 'Motivations', x: 650, y: 450, width: 150, height: 60, color: '#f1f1f1', textColor: '#333',
      description: 'Questions sur vos objectifs et motivations' },
    { id: 'results', text: 'Résultats', x: 650, y: 540, width: 150, height: 60, color: '#4a86e8', textColor: 'white',
      description: 'Synthèse de votre profil et recommandations' }
  ];

  // Define connections
  const connections = [
    { from: 'welcome', to: 'general-info', label: '' },
    { from: 'general-info', to: 'schooling', label: '' },
    { from: 'schooling', to: 'alpha', label: 'Non scolarisé' },
    { from: 'schooling', to: 'fle', label: 'Autre langue' },
    { from: 'schooling', to: 'illiteracy', label: 'Français' },
    
    { from: 'fle', to: 'fle-a1', label: '' },
    { from: 'fle', to: 'fle-a2', label: '' },
    { from: 'fle', to: 'fle-b1', label: '' },
    
    { from: 'illiteracy', to: 'illiteracy-profile', label: '' },
    { from: 'illiteracy', to: 'refresher', label: '' },
    
    { from: 'alpha', to: 'motivations', label: '' },
    { from: 'fle-a1', to: 'motivations', label: '' },
    { from: 'fle-a2', to: 'motivations', label: '' },
    { from: 'fle-b1', to: 'motivations', label: '' },
    { from: 'illiteracy-profile', to: 'motivations', label: '' },
    { from: 'refresher', to: 'motivations', label: '' },
    
    { from: 'motivations', to: 'results', label: '' }
  ];

  // Draw connections
  connections.forEach(conn => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);
    
    if (fromNode && toNode) {
      // Calculate start and end points
      let startX, startY, endX, endY;
      
      // Determine connection points based on relative positions
      if (toNode.y > fromNode.y) { // Down connection
        startX = fromNode.x + fromNode.width / 2;
        startY = fromNode.y + fromNode.height;
        endX = toNode.x + toNode.width / 2;
        endY = toNode.y;
      } else if (toNode.x > fromNode.x) { // Right connection
        startX = fromNode.x + fromNode.width;
        startY = fromNode.y + fromNode.height / 2;
        endX = toNode.x;
        endY = toNode.y + toNode.height / 2;
      } else { // Left connection
        startX = fromNode.x;
        startY = fromNode.y + fromNode.height / 2;
        endX = toNode.x + toNode.width;
        endY = toNode.y + toNode.height / 2;
      }
      
      // Create path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Define the path with a bezier curve
      let d;
      if (toNode.y > fromNode.y) { // Vertical connection
        const controlY = (fromNode.y + toNode.y) / 2;
        d = `M${startX},${startY} C${startX},${controlY} ${endX},${controlY} ${endX},${endY}`;
      } else { // Horizontal connection
        const controlX = (fromNode.x + toNode.x) / 2;
        d = `M${startX},${startY} C${controlX},${startY} ${controlX},${endY} ${endX},${endY}`;
      }
      
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(204, 204, 204, 0.6)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-dasharray', '0');
      svg.appendChild(path);
      
      // Add arrow at the end
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const angle = Math.atan2(endY - startY, endX - startX);
      const arrowSize = 8;
      
      const arrowPoints = [
        endX, endY,
        endX - arrowSize * Math.cos(angle - Math.PI/6), endY - arrowSize * Math.sin(angle - Math.PI/6),
        endX - arrowSize * Math.cos(angle + Math.PI/6), endY - arrowSize * Math.sin(angle + Math.PI/6)
      ];
      
      arrow.setAttribute('points', arrowPoints.join(','));
      arrow.setAttribute('fill', 'rgba(204, 204, 204, 0.8)');
      svg.appendChild(arrow);
      
      // Add connection label if provided
      if (conn.label) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const textX = (startX + endX) / 2;
        const textY = (startY + endY) / 2 - 5;
        
        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12px');
        text.setAttribute('fill', '#666');
        text.textContent = conn.label;
        svg.appendChild(text);
      }
    }
  });
  
  // Draw nodes
  nodes.forEach(node => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('flowchart-node');
    group.setAttribute('data-id', node.id);
    group.setAttribute('cursor', 'pointer');
    
    // Create rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', node.x);
    rect.setAttribute('y', node.y);
    rect.setAttribute('width', node.width);
    rect.setAttribute('height', node.height);
    rect.setAttribute('rx', '12');
    rect.setAttribute('ry', '12');
    rect.setAttribute('fill', node.color);
    rect.setAttribute('stroke', 'rgba(153, 153, 153, 0.2)');
    rect.setAttribute('stroke-width', '1');
    rect.setAttribute('filter', 'drop-shadow(0px 3px 3px rgba(0,0,0,0.1))');
    
    // Create text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x + node.width / 2);
    text.setAttribute('y', node.y + node.height / 2 + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '14px');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', node.textColor || 'white');
    text.textContent = node.text;
    
    group.appendChild(rect);
    group.appendChild(text);
    svg.appendChild(group);
    
    // Add hover effect and tooltip
    group.addEventListener('mouseover', () => {
      rect.setAttribute('filter', 'drop-shadow(0px 6px 8px rgba(0,0,0,0.2))');
      rect.setAttribute('transform', 'translate(0, -2)');
      rect.setAttribute('stroke-width', '2');
      
      // Show tooltip
      const tooltip = document.getElementById('flowchart-tooltip');
      if (tooltip) {
        tooltip.textContent = node.description;
        tooltip.style.display = 'block';
        
        // Position tooltip near the node
        const containerRect = flowchartContainer.getBoundingClientRect();
        const nodeRect = rect.getBoundingClientRect();
        
        tooltip.style.left = (nodeRect.left - containerRect.left + nodeRect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = (nodeRect.top - containerRect.top - tooltip.offsetHeight - 10) + 'px';
      }
    });
    
    group.addEventListener('mouseout', () => {
      rect.setAttribute('filter', 'drop-shadow(0px 3px 3px rgba(0,0,0,0.1))');
      rect.setAttribute('transform', 'translate(0, 0)');
      rect.setAttribute('stroke-width', '1');
      
      // Hide tooltip
      const tooltip = document.getElementById('flowchart-tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    });
    
    // Add click interaction
    group.addEventListener('click', () => {
      // Highlight the clicked node
      nodes.forEach(n => {
        const nodeElement = document.querySelector(`.flowchart-node[data-id="${n.id}"]`);
        if (nodeElement) {
          const rectElement = nodeElement.querySelector('rect');
          rectElement.setAttribute('stroke-width', n.id === node.id ? '3' : '1');
          rectElement.setAttribute('stroke', n.id === node.id ? 'rgba(51, 51, 51, 0.4)' : 'rgba(153, 153, 153, 0.2)');
        }
      });
      
      // Update the description panel
      const descriptionPanel = document.getElementById('flowchart-description');
      if (descriptionPanel) {
        descriptionPanel.innerHTML = `
          <h3 style="color: ${node.color};">${node.text}</h3>
          <p>${node.description}</p>
        `;
      }
    });
  });
  
  // Trigger click on welcome node to show initial description
  setTimeout(() => {
    const welcomeNode = document.querySelector('.flowchart-node[data-id="welcome"]');
    if (welcomeNode) {
      welcomeNode.dispatchEvent(new Event('click'));
    }
  }, 500);
}