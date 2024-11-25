const container = document.getElementById("container");
const toolButtons = document.querySelectorAll(".tool-btn");

let elementCounter = 0;

function removeEmptyState() {
  const emptyState = document.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }
}

function setupElementControls(element, type) {
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    element.remove();

    if (container.children.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plus-circle"></i>
                    <p>Click the buttons below to add form elements</p>
                </div>
            `;
    }
  });

  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    const label = element.querySelector(".label");
    const newText = prompt("Enter new label:", label.textContent);
    if (newText) {
      label.textContent = newText;
    }
  });
}

function createFormElement(type){
    elementCounter++;
    const element = document.createElement('div');
    element.className = 'form-element';
    element.draggable = true;


    const controls = `
        <div class="element-controls">
            <button class="control-btn edit-btn" title="Edit Label">
                <i class="fas fa-edit"></i>
            </button>
            ${type === 'select' || type === 'radio' || type === 'checkbox' ? `
                <button class="control-btn add-option-btn" title="Add Option">
                    <i class="fas fa-plus"></i>
                </button>
            ` : ''}
            <button class="control-btn delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    let content = '';
    switch (type) {
        case 'text':
            content = `
                <label class="label">Text Input ${elementCounter}</label>
                <input type="text" placeholder="Enter text here...">
            `;
            break;
            
        case 'textarea':
            content = `
                <label class="label">Textarea ${elementCounter}</label>
                <textarea rows="3" placeholder="Enter longer text here..."></textarea>
            `;
            break;
            
        case 'select':
            content = `
                <label class="label">Dropdown ${elementCounter}</label>
                <div class="options-container">
                    <select>
                        <option value="">Select an option</option>
                        <option value="1" data-option-id="1">Option 1</option>
                    </select>
                    <div class="options-list">
                        <div class="option-item" data-option-id="1">
                            <input type="text" value="Option 1" class="option-text">
                            <button class="delete-option-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'radio':
            content = `
                <label class="label">Radio Group ${elementCounter}</label>
                <div class="options-container">
                    <div class="radio-group">
                        <div class="option-item" data-option-id="1">
                            <label>
                                <input type="radio" name="radio${elementCounter}" value="1">
                                <input type="text" value="Option 1" class="option-text">
                            </label>
                            <button class="delete-option-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'checkbox':
            content = `
                <label class="label">Checkbox Group ${elementCounter}</label>
                <div class="options-container">
                    <div class="checkbox-group">
                        <div class="option-item" data-option-id="1">
                            <label>
                                <input type="checkbox" value="1">
                                <input type="text" value="Option 1" class="option-text">
                            </label>
                            <button class="delete-option-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;
        }


        element.innerHTML = controls + content;
        setupElementControls(element, type);
        if (type === 'select' || type === 'radio' || type === 'checkbox') {
            setupOptionsHandlers(element, type);
        }
            
        setupDragAndDrop(element);
    
        return element;
}



function setupOptionsHandlers(element, type){
    const optionsContainer = element.querySelector(".options-container");
    let optionCounter = 1;

    const addOptionBtn = element.querySelector('.add-option-btn');

    addOptionBtn.addEventListener("click", () => {
        optionCounter++;
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.dataset.optionId = optionCounter;

        switch(type){
            case "select":
                const select = optionsContainer.querySelector('select');
                const option = document.createElement('option');
                option.value = optionCounter;
                option.textContent = `Option ${optionCounter}`;
                option.dataset.optionId = optionCounter;
                select.appendChild(option);

                optionItem.innerHTML = `
                     <input type="text" value="Option ${optionCounter}" class="option-text">
                    <button class="delete-option-btn">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                optionsContainer.querySelector('.options-list').appendChild(optionItem);
                break;

            case "radio":
                optionItem.innerHTML = `
                <label>
                        <input type="radio" name="radio${elementCounter}" value="${optionCounter}">
                        <input type="text" value="Option ${optionCounter}" class="option-text">
                    </label>
                    <button class="delete-option-btn">
                        <i class="fas fa-times"></i>
                    </button>`;

                optionsContainer.querySelector(".radio-group").appendChild(optionItem);
                break;

            case "checkbox":
                optionItem.innerHTML = ` <label>
                        <input type="checkbox" value="${optionCounter}">
                        <input type="text" value="Option ${optionCounter}" class="option-text">
                    </label>
                    <button class="delete-option-btn">
                        <i class="fas fa-times"></i>
                    </button>`

                optionsContainer.querySelector('.checkbox-group').appendChild(optionItem);
                break;                       
        }
        setupOptionItemHandlers(optionItem, element, type);
    })
}


function setupOptionItemHandlers(optionItem, element, type) {
    const optionText = optionItem.querySelector('.option-text');
    const deleteBtn = optionItem.querySelector('.delete-option-btn');
    const optionId = optionItem.dataset.optionId;


    optionText.addEventListener('input', () => {
        if (type === 'select') {
            const select = element.querySelector('select');
            const option = select.querySelector(`option[data-option-id="${optionId}"]`);
            if (option) {
                option.textContent = optionText.value;
            }
        }
    });

    deleteBtn.addEventListener('click', () => {
        if (type === 'select') {
            const select = element.querySelector('select');
            const option = select.querySelector(`option[data-option-id="${optionId}"]`);
            if (option) {
                option.remove();
            }
        }
        optionItem.remove();
    });

}

function setupDragAndDrop(element) {
    element.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
    });

    element.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(container, e.clientY);
    
    if (afterElement) {
        container.insertBefore(draggingElement, afterElement);
    } else {
        container.appendChild(draggingElement);
    }
});


toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        removeEmptyState();
        const type = button.getAttribute('data-type');
        const newElement = createFormElement(type);
        container.appendChild(newElement);
    });
});