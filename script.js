class AVLNode {
    constructor(val) {
        this.value = val;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.isNew = false;
        this.isRotating = false;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.history = [];
        this.animationSteps = [];
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    updateHeight(node) {
        if (node) {
            node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        }
    }

    rightRotate(y) {
        this.animationSteps.push({ 
            type: 'rotate', 
            direction: 'right', 
            node: y.value,
            pivot: y.left.value,
            description: `Right rotation: ${y.left.value} becomes parent of ${y.value}`
        });
        
        const x = y.left;
        const T = x.right;

        x.right = y;
        y.left = T;

        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    leftRotate(x) {
        this.animationSteps.push({ 
            type: 'rotate', 
            direction: 'left', 
            node: x.value,
            pivot: x.right.value,
            description: `Left rotation: ${x.right.value} becomes parent of ${x.value}`
        });
        
        const y = x.right;
        const T = y.left;

        y.left = x;
        x.right = T;

        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    insert(node, value) {
        if (!node) {
            const newNode = new AVLNode(value);
            newNode.isNew = true;
            this.animationSteps.push({ type: 'insert', value: value });
            return newNode;
        }

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node;
        }

        this.updateHeight(node);

        const balance = this.getBalance(node);

        // Left Left
        if (balance > 1 && value < node.left.value) {
            return this.rightRotate(node);
        }

        // Right Right
        if (balance < -1 && value > node.right.value) {
            return this.leftRotate(node);
        }

        // Left Right
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    insertValue(value) {
        this.history.push(this.cloneTree(this.root));
        this.animationSteps = [];
        this.root = this.insert(this.root, value);
        return this.animationSteps;
    }

    cloneTree(node) {
        if (!node) return null;
        const newNode = new AVLNode(node.value);
        newNode.height = node.height;
        newNode.left = this.cloneTree(node.left);
        newNode.right = this.cloneTree(node.right);
        return newNode;
    }

    undo() {
        if (this.history.length > 0) {
            this.root = this.history.pop();
            return true;
        }
        return false;
    }

    clear() {
        this.root = null;
        this.history = [];
    }

    clearNewFlags(node) {
        if (!node) return;
        node.isNew = false;
        this.clearNewFlags(node.left);
        this.clearNewFlags(node.right);
    }
}

const tree = new AVLTree();
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const logEntries = document.getElementById('logEntries');
const logPanel = document.getElementById('logPanel');
let animating = false;

function toggleLog() {
    logPanel.classList.toggle('open');
}

function addLogEntry(type, message, diagram = null) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = message;
    
    if (diagram) {
        const diagramDiv = document.createElement('div');
        diagramDiv.className = 'rotation-diagram';
        diagramDiv.textContent = diagram;
        entry.appendChild(diagramDiv);
    }
    
    logEntries.insertBefore(entry, logEntries.firstChild);
    
    // Keep only last 20 entries
    while (logEntries.children.length > 20) {
        logEntries.removeChild(logEntries.lastChild);
    }
}

function getRotationDiagram(direction, pivot, node) {
    if (direction === 'right') {
        return `Before:     ${node}          After:      ${pivot}
        /                        \\
      ${pivot}         →           ${node}
        \\                        /
        ...                    ...`;
    } else {
        return `Before:   ${node}            After:    ${pivot}
          \\                      /
          ${pivot}       →        ${node}
          /                      \\
        ...                    ...`;
    }
}

function drawNode(x, y, value, height, balance, scale = 1, highlight = false) {
    const radius = 30 * scale;
    
    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Circle gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    if (highlight) {
        gradient.addColorStop(0, '#f093fb');
        gradient.addColorStop(1, '#f5576c');
    } else {
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Value
    ctx.fillStyle = 'white';
    ctx.font = `bold ${18 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);

    // Height and Balance labels
    ctx.font = '10px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`h:${height}`, x, y + radius + 12);
    
    const balanceColor = Math.abs(balance) > 1 ? '#f5576c' : '#4facfe';
    ctx.fillStyle = balanceColor;
    ctx.fillText(`b:${balance}`, x, y + radius + 24);
}

function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawTree(node, x, y, level, offset) {
    if (!node) return;

    const verticalGap = 80;
    const balance = tree.getBalance(node);

    if (node.left) {
        const leftX = x - offset;
        const leftY = y + verticalGap;
        drawLine(x, y + 30, leftX, leftY - 30);
        drawTree(node.left, leftX, leftY, level + 1, offset / 2);
    }

    if (node.right) {
        const rightX = x + offset;
        const rightY = y + verticalGap;
        drawLine(x, y + 30, rightX, rightY - 30);
        drawTree(node.right, rightX, rightY, level + 1, offset / 2);
    }

    drawNode(x, y, node.value, node.height, balance, 1, node.isNew);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (tree.root) {
        drawTree(tree.root, canvas.width / 2, 50, 0, 200);
    } else {
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Tree is empty. Insert nodes to visualize!', canvas.width / 2, canvas.height / 2);
    }
}

async function animateInsertion(steps) {
    animating = true;
    
    for (let step of steps) {
        if (step.type === 'insert') {
            addLogEntry('insert', `<strong>Inserted node:</strong> ${step.value}`);
            
            // Pulse animation for new node
            for (let i = 0; i < 3; i++) {
                await new Promise(resolve => setTimeout(resolve, 150));
                render();
            }
            status.textContent = `✨ Inserting ${step.value}...`;
        } else if (step.type === 'rotate') {
            const rotationType = step.direction === 'left' ? 'Left' : 'Right';
            const diagram = getRotationDiagram(step.direction, step.pivot, step.node);
            
            addLogEntry('rotation', 
                `<strong>Rotation:</strong> <span class="rotation-type">${rotationType.toUpperCase()}</span> ${step.description}`,
                diagram
            );
            
            status.textContent = `🔄 Performing ${step.direction} rotation...`;
            
            // Show rotation animation
            for (let i = 0; i < 5; i++) {
                await new Promise(resolve => setTimeout(resolve, 100));
                render();
            }
        }
    }

    tree.clearNewFlags(tree.root);
    render();
    
    addLogEntry('complete', `<strong>✓ Complete:</strong> Tree is balanced!`);
    status.textContent = `✓ Insertion complete! Tree is balanced.`;
    status.style.color = '#4facfe';
    
    animating = false;
}

async function insertNode() {
    if (animating) return;
    
    const input = document.getElementById('nodeValue');
    const value = parseInt(input.value);

    if (isNaN(value)) {
        status.textContent = '⚠️ Please enter a valid number';
        status.style.color = '#f5576c';
        return;
    }

    const steps = tree.insertValue(value);
    input.value = '';
    
    await animateInsertion(steps);
}

function undoInsert() {
    if (animating) return;
    
    if (tree.undo()) {
        status.textContent = '↶ Undone last insertion';
        status.style.color = '#f093fb';
        render();
    } else {
        status.textContent = '⚠️ Nothing to undo';
        status.style.color = '#f5576c';
    }
}

function clearAll() {
    if (animating) return;
    
    tree.clear();
    logEntries.innerHTML = '';
    addLogEntry('complete', '<strong>🗑️ Tree cleared</strong>');
    status.textContent = '🗑️ Tree cleared';
    status.style.color = '#4facfe';
    render();
}

document.getElementById('nodeValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        insertNode();
    }
});

render();