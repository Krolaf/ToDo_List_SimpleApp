// Classe principale pour gérer l'application To-Do List
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentTaskId = 0;
        this.activeMenuTaskId = null;
        this.editingTaskId = null;
        this.addSubtasks = [];
        this.editSubtasks = [];
        this.lastSubtasksState = {};
        
        // Éléments DOM
        this.elements = {
            taskInput: document.getElementById('taskInput'),
            addTaskForm: document.getElementById('addTaskForm'),
            tasksList: document.getElementById('tasksList'),
            emptyState: document.getElementById('emptyState'),
            circularMenu: document.getElementById('circularMenu'),
            circularMenuCenter: document.getElementById('circularMenuCenter'),
            editModal: document.getElementById('editModal'),
            editInput: document.getElementById('editInput'),
            closeModal: document.getElementById('closeModal'),
            cancelEdit: document.getElementById('cancelEdit'),
            saveEdit: document.getElementById('saveEdit'),
            totalTasks: document.getElementById('totalTasks'),
            completedTasks: document.getElementById('completedTasks'),
            progressPercentage: document.getElementById('progressPercentage'),
            addSubtasksCheckbox: document.getElementById('addSubtasksCheckbox'),
            addSubtasksUI: document.getElementById('addSubtasksUI'),
            addSubtasksList: document.getElementById('addSubtasksList'),
            addSubtaskInput: document.getElementById('addSubtaskInput'),
            addSubtaskBtn: document.getElementById('addSubtaskBtn'),
            editSubtasksCheckbox: document.getElementById('editSubtasksCheckbox'),
            editSubtasksUI: document.getElementById('editSubtasksUI'),
            editSubtasksList: document.getElementById('editSubtasksList'),
            editSubtaskInput: document.getElementById('editSubtaskInput'),
            editSubtaskBtn: document.getElementById('editSubtaskBtn')
        };
        
        this.init();
    }
    
    // Initialisation de l'application
    init() {
        this.loadTasks();
        this.bindEvents();
        this.updateStats();
        this.updateEmptyState();
    }
    
    // Liaison des événements
    bindEvents() {
        // Formulaire d'ajout de tâche
        this.elements.addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
        
        // Fermeture du menu circulaire en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.circular-menu') && !e.target.closest('.task-item')) {
                this.hideCircularMenu();
            }
        });
        
        // Gestion des touches du clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCircularMenu();
                this.closeEditModal();
            }
        });
        
        // Événements du modal d'édition
        this.elements.closeModal.addEventListener('click', () => this.closeEditModal());
        this.elements.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.elements.saveEdit.addEventListener('click', () => this.saveEdit());
        this.elements.editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveEdit();
            }
        });
        
        // Clic sur l'overlay du modal
        this.elements.editModal.addEventListener('click', (e) => {
            if (e.target === this.elements.editModal) {
                this.closeEditModal();
            }
        });
        
        // Ajout : fermer le menu circulaire en cliquant sur le centre
        this.elements.circularMenuCenter.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideCircularMenu();
        });
        
        // Sous-tâches - Ajout
        this.elements.addSubtasksCheckbox.addEventListener('change', (e) => {
            this.elements.addSubtasksUI.style.display = e.target.checked ? '' : 'none';
            if (!e.target.checked) this.addSubtasks = [];
            this.renderSubtasksList('add');
        });
        this.elements.addSubtaskBtn.addEventListener('click', () => this.addSubtask('add'));
        this.elements.addSubtaskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addSubtask('add');
        });
        // Sous-tâches - Edition
        this.elements.editSubtasksCheckbox.addEventListener('change', (e) => {
            this.elements.editSubtasksUI.style.display = e.target.checked ? '' : 'none';
            if (!e.target.checked) this.editSubtasks = [];
            this.renderSubtasksList('edit');
        });
        this.elements.editSubtaskBtn.addEventListener('click', () => this.addSubtask('edit'));
        this.elements.editSubtaskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addSubtask('edit');
        });
    }
    
    // Ajouter une nouvelle tâche
    addTask() {
        const text = this.elements.taskInput.value.trim();
        if (!text) return;
        const hasSubtasks = this.elements.addSubtasksCheckbox.checked;
        const subtasks = hasSubtasks ? this.addSubtasks.map(s => ({...s})) : [];
        const task = {
            id: ++this.currentTaskId,
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            subtasks: subtasks
        };
        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task);
        this.updateStats();
        this.updateEmptyState();
        this.elements.taskInput.value = '';
        this.elements.addSubtasksCheckbox.checked = false;
        this.elements.addSubtasksUI.style.display = 'none';
        this.addSubtasks = [];
        this.renderSubtasksList('add');
        this.elements.taskInput.focus();
        this.showSuccessFeedback();
    }
    
    // Rendre une tâche dans le DOM
    renderTask(task) {
        const taskElement = document.createElement('li');
        taskElement.className = `task-item${task.completed ? ' completed' : ''}${task.subtasks && task.subtasks.length > 0 ? ' has-subtasks' : ''}`;
        taskElement.dataset.taskId = task.id;
        let subtasksHtml = '';
        let progressHtml = '';
        let isDropdown = false;
        if (task.subtasks && task.subtasks.length > 0) {
            isDropdown = true;
            const done = task.subtasks.filter(st => st.completed).length;
            const total = task.subtasks.length;
            const percent = Math.round((done/total)*100);
            progressHtml = `<div class=\"subtasks-progress\">${done} / ${total} sous-tâches (${percent}%)</div>`;
            subtasksHtml = `<div class=\"subtasks-dropdown\" style=\"display:none\">
                <ul class=\"subtasks-list\">${task.subtasks.map((st, i) => `
                    <li>
                        <span class=\"subtask-checkbox${st.completed ? ' checked' : ''}\" data-taskid=\"${task.id}\" data-subidx=\"${i}\"></span>
                        <span class=\"subtask-text\">${this.escapeHtml(st.text)}</span>
                    </li>`).join('')}</ul>
                ${percent === 100 && !task.completed ? `<button class=\"subtasks-validate-btn\" data-taskid=\"${task.id}\">Valider la tâche</button>` : ''}
            </div>`;
        }
        // Bloc contenu à gauche, menu circulaire à droite
        taskElement.innerHTML = `
            <div class=\"task-content\">
                <div class=\"task-checkbox ${task.completed ? 'checked' : ''}\" onclick=\"event.stopPropagation(); todoApp.toggleTask(${task.id})\"></div>
                <span class=\"task-text\">${this.escapeHtml(task.text)}</span>
                ${progressHtml}
                ${subtasksHtml}
            </div>
            <div class=\"task-actions\"></div>
        `;
        // Dropdown toggle
        if (isDropdown) {
            taskElement.addEventListener('click', (e) => {
                if (
                    !e.target.classList.contains('task-checkbox') &&
                    !e.target.classList.contains('subtask-checkbox') &&
                    !e.target.classList.contains('subtasks-validate-btn') &&
                    !e.target.closest('.circular-menu')
                ) {
                    const dropdown = taskElement.querySelector('.subtasks-dropdown');
                    if (dropdown) {
                        const isOpen = dropdown.style.display === '';
                        dropdown.style.display = isOpen ? 'none' : '';
                        taskElement.classList.toggle('open', !isOpen);
                    }
                }
            });
        }
        // Clic menu circulaire
        taskElement.addEventListener('click', (e) => {
            if (
                !e.target.classList.contains('task-checkbox') &&
                !e.target.classList.contains('subtask-checkbox') &&
                !e.target.classList.contains('subtasks-validate-btn') &&
                !e.target.closest('.subtasks-dropdown')
            ) {
                this.showCircularMenu(e, task.id);
            }
        });
        // Sous-tâches : toggle
        if (task.subtasks && task.subtasks.length > 0) {
            taskElement.querySelectorAll('.subtask-checkbox').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const subIdx = parseInt(el.dataset.subidx);
                    this.toggleSubtask(task.id, subIdx);
                });
            });
            // Valider la tâche
            const validateBtn = taskElement.querySelector('.subtasks-validate-btn');
            if (validateBtn) {
                validateBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Valider la tâche principale
                    this.toggleTask(task.id, true);
                    // Fermer menu circulaire et dropdown
                    this.hideCircularMenu();
                });
            }
        }
        // Empêcher la fermeture du dropdown quand on clique à l'intérieur
        if (isDropdown) {
            const dropdown = taskElement.querySelector('.subtasks-dropdown');
            if (dropdown) {
                dropdown.addEventListener('click', (e) => { e.stopPropagation(); });
            }
        }
        this.elements.tasksList.appendChild(taskElement);
    }
    
    // Afficher le menu circulaire
    showCircularMenu(event, taskId) {
        this.hideCircularMenu();
        // Toujours cibler la carte entière
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        const rect = taskElement.getBoundingClientRect();
        const menu = this.elements.circularMenu;
        // Positionner le menu en haut à droite de la carte
        const menuX = rect.right + window.scrollX - 10; // 10px de marge
        const menuY = rect.top + window.scrollY + 10;   // 10px de marge
        menu.style.left = `${menuX}px`;
        menu.style.top = `${menuY}px`;
        menu.classList.add('active');
        this.activeMenuTaskId = taskId;
        // Dérouler la liste si sous-tâches
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.subtasks && task.subtasks.length > 0) {
            if (taskElement) {
                const dropdown = taskElement.querySelector('.subtasks-dropdown');
                if (dropdown) {
                    dropdown.style.display = '';
                    taskElement.classList.add('open');
                }
            }
        }
        this.bindMenuEvents();
    }
    
    // Masquer le menu circulaire
    hideCircularMenu() {
        this.elements.circularMenu.classList.remove('active');
        // Replier la liste si sous-tâches
        if (this.activeMenuTaskId) {
            const task = this.tasks.find(t => t.id === this.activeMenuTaskId);
            if (task && task.subtasks && task.subtasks.length > 0) {
                const taskDom = document.querySelector(`[data-task-id="${this.activeMenuTaskId}"]`);
                if (taskDom) {
                    const dropdown = taskDom.querySelector('.subtasks-dropdown');
                    if (dropdown) {
                        dropdown.style.display = 'none';
                        taskDom.classList.remove('open');
                    }
                }
            }
        }
        this.activeMenuTaskId = null;
    }
    
    // Lier les événements du menu circulaire
    bindMenuEvents() {
        const menuItems = this.elements.circularMenu.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const action = item.dataset.action;
            
            // Supprimer les anciens événements
            item.replaceWith(item.cloneNode(true));
            
            // Récupérer le nouvel élément
            const newItem = this.elements.circularMenu.querySelector(`[data-action="${action}"]`);
            
            // Ajouter le nouvel événement
            newItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleMenuAction(action);
            });
        });
    }
    
    // Gérer les actions du menu circulaire
    handleMenuAction(action) {
        if (!this.activeMenuTaskId) return;
        
        const task = this.tasks.find(t => t.id === this.activeMenuTaskId);
        if (!task) return;
        
        switch (action) {
            case 'toggle':
                this.toggleTask(this.activeMenuTaskId);
                break;
            case 'edit':
                this.openEditModal(this.activeMenuTaskId);
                break;
            case 'delete':
                this.deleteTask(this.activeMenuTaskId);
                break;
            case 'moveUp':
                this.moveTask(this.activeMenuTaskId, 'up');
                break;
            case 'moveDown':
                this.moveTask(this.activeMenuTaskId, 'down');
                break;
        }
        
        this.hideCircularMenu();
    }
    
    // Basculer l'état d'une tâche
    toggleTask(taskId, fromValidateBtn = false) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        // Gestion sous-tâches :
        if (task.subtasks && task.subtasks.length > 0) {
            if (!task.completed) {
                // On coche la tâche principale
                // Sauvegarder l'état précédent
                this.lastSubtasksState[taskId] = task.subtasks.map(st => st.completed);
                // Si action via menu circulaire ou bouton valider, cocher toutes les sous-tâches
                if (fromValidateBtn || this.activeMenuTaskId === taskId) {
                    task.subtasks.forEach(st => st.completed = true);
                }
            } else {
                // On décoche la tâche principale
                // Restaurer l'état précédent si connu
                if (this.lastSubtasksState[taskId]) {
                    task.subtasks.forEach((st, i) => {
                        st.completed = this.lastSubtasksState[taskId][i];
                    });
                }
            }
        }
        task.completed = !task.completed;
        this.saveTasks();
        this.updateTaskElement(taskId);
        this.updateStats();
        this.renderTasks();
    }
    
    // Mettre à jour l'élément DOM d'une tâche
    updateTaskElement(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (!taskElement) return;
        
        const checkbox = taskElement.querySelector('.task-checkbox');
        const textElement = taskElement.querySelector('.task-text');
        
        taskElement.classList.toggle('completed', task.completed);
        checkbox.classList.toggle('checked', task.completed);
    }
    
    // Ouvrir le modal d'édition
    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        this.editingTaskId = taskId;
        this.elements.editInput.value = task.text;
        // Sous-tâches
        if (task.subtasks && task.subtasks.length > 0) {
            this.elements.editSubtasksCheckbox.checked = true;
            this.elements.editSubtasksUI.style.display = '';
            this.editSubtasks = task.subtasks.map(s => ({...s}));
        } else {
            this.elements.editSubtasksCheckbox.checked = false;
            this.elements.editSubtasksUI.style.display = 'none';
            this.editSubtasks = [];
        }
        this.renderSubtasksList('edit');
        this.elements.editModal.classList.add('active');
        this.elements.editInput.focus();
        this.elements.editInput.select();
    }
    
    // Fermer le modal d'édition
    closeEditModal() {
        this.elements.editModal.classList.remove('active');
        this.editingTaskId = null;
        this.elements.editInput.value = '';
    }
    
    // Sauvegarder l'édition
    saveEdit() {
        if (!this.editingTaskId) return;
        const newText = this.elements.editInput.value.trim();
        if (!newText) return;
        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (!task) return;
        task.text = newText;
        // Sous-tâches
        if (this.elements.editSubtasksCheckbox.checked) {
            task.subtasks = this.editSubtasks.map(s => ({...s}));
        } else {
            task.subtasks = [];
        }
        this.saveTasks();
        this.renderTasks();
        this.closeEditModal();
        this.showSuccessFeedback();
    }
    
    // Supprimer une tâche
    deleteTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (!taskElement) return;
        
        // Animation de suppression
        taskElement.classList.add('removing');
        
        setTimeout(() => {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            taskElement.remove();
            this.updateStats();
            this.updateEmptyState();
        }, 300);
    }
    
    // Déplacer une tâche
    moveTask(taskId, direction) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        const newIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;
        
        if (newIndex >= 0 && newIndex < this.tasks.length) {
            // Échanger les positions dans le tableau
            [this.tasks[taskIndex], this.tasks[newIndex]] = [this.tasks[newIndex], this.tasks[taskIndex]];
            this.saveTasks();
            
            // Re-rendre la liste
            this.renderTasks();
        }
    }
    
    // Re-rendre toutes les tâches
    renderTasks() {
        this.elements.tasksList.innerHTML = '';
        this.tasks.forEach(task => this.renderTask(task));
    }
    
    // Mettre à jour les statistiques
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        this.elements.totalTasks.textContent = total;
        this.elements.completedTasks.textContent = completed;
        this.elements.progressPercentage.textContent = `${percentage}%`;
    }
    
    // Mettre à jour l'état vide
    updateEmptyState() {
        if (this.tasks.length === 0) {
            this.elements.emptyState.classList.add('show');
        } else {
            this.elements.emptyState.classList.remove('show');
        }
    }
    
    // Sauvegarder les tâches dans le localStorage
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        localStorage.setItem('todoCurrentId', this.currentTaskId.toString());
    }
    
    // Charger les tâches depuis le localStorage
    loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        const savedCurrentId = localStorage.getItem('todoCurrentId');
        
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
        
        if (savedCurrentId) {
            this.currentTaskId = parseInt(savedCurrentId);
        }
        
        this.renderTasks();
    }
    
    // Échapper le HTML pour éviter les injections
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Afficher un feedback de succès
    showSuccessFeedback() {
        // Créer un élément de feedback temporaire
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;
        feedback.textContent = '✅ Tâche sauvegardée !';
        
        document.body.appendChild(feedback);
        
        // Animation d'entrée
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);
        
        // Animation de sortie
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }
    
    // Ajout/suppression/toggle sous-tâche dans le formulaire
    addSubtask(mode) {
        const input = mode === 'add' ? this.elements.addSubtaskInput : this.elements.editSubtaskInput;
        const list = mode === 'add' ? this.addSubtasks : this.editSubtasks;
        const val = input.value.trim();
        if (!val) return;
        list.push({text: val, completed: false});
        input.value = '';
        this.renderSubtasksList(mode);
    }
    removeSubtask(mode, idx) {
        const list = mode === 'add' ? this.addSubtasks : this.editSubtasks;
        list.splice(idx, 1);
        this.renderSubtasksList(mode);
    }
    toggleSubtaskInForm(mode, idx) {
        const list = mode === 'add' ? this.addSubtasks : this.editSubtasks;
        list[idx].completed = !list[idx].completed;
        this.renderSubtasksList(mode);
    }
    renderSubtasksList(mode) {
        const list = mode === 'add' ? this.addSubtasks : this.editSubtasks;
        const ul = mode === 'add' ? this.elements.addSubtasksList : this.elements.editSubtasksList;
        ul.innerHTML = list.map((st, i) => `
            <li>
                <span class="subtask-checkbox${st.completed ? ' checked' : ''}" data-idx="${i}"></span>
                <span class="subtask-text">${this.escapeHtml(st.text)}</span>
                <button class="subtask-delete" data-idx="${i}" title="Supprimer">&#10005;</button>
            </li>
        `).join('');
        ul.querySelectorAll('.subtask-checkbox').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(el.dataset.idx);
                this.toggleSubtaskInForm(mode, idx);
            });
        });
        ul.querySelectorAll('.subtask-delete').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(el.dataset.idx);
                this.removeSubtask(mode, idx);
            });
        });
    }
    toggleSubtask(taskId, subIdx) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) return;
        const wasCompleted = task.completed;
        task.subtasks[subIdx].completed = !task.subtasks[subIdx].completed;
        // Si la tâche principale est cochée et qu'on décoche une sous-tâche, dévalider la tâche principale
        if (wasCompleted && !task.subtasks[subIdx].completed) {
            task.completed = false;
        }
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        if (this.activeMenuTaskId === taskId) {
            const taskDom = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskDom) {
                const dropdown = taskDom.querySelector('.subtasks-dropdown');
                if (dropdown) {
                    dropdown.style.display = '';
                    taskDom.classList.add('open');
                }
            }
        }
    }
}

// Initialiser l'application quand le DOM est chargé
let todoApp;

document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});

// Exposer l'instance globalement pour les événements inline
window.todoApp = todoApp; 