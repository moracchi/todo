// DOM要素の取得
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// タスクの配列
let tasks = [];

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    // ローカルストレージからタスクを読み込む
    loadTasks();
    
    // 画面にタスクを表示
    renderTasks();
    
    // イベントリスナーの設定
    addEventListeners();
});

// イベントリスナーの設定
function addEventListeners() {
    // タスク追加ボタンのクリックイベント
    addTaskBtn.addEventListener('click', addTask);
    
    // 入力フィールドでのEnterキー押下イベント
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // 完了したタスクをクリアするボタンのイベント
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// タスクを追加する関数
function addTask() {
    const text = taskInput.value.trim();
    
    // 空の場合は何もしない
    if (text === '') {
        return;
    }
    
    // 新しいタスクオブジェクトを作成
    const task = {
        id: Date.now(), // ユニークIDとしてタイムスタンプを使用
        text: text,
        completed: false,
        createdAt: new Date()
    };
    
    // タスク配列に追加
    tasks.push(task);
    
    // 入力フィールドをクリア
    taskInput.value = '';
    
    // ローカルストレージに保存
    saveTasks();
    
    // タスクリストを更新
    renderTasks();
    
    // 入力フィールドにフォーカスを戻す
    taskInput.focus();
}

// タスクリストをレンダリングする関数
function renderTasks() {
    // タスクリストをクリア
    taskList.innerHTML = '';
    
    // 残りのタスク数をカウント
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `残りのタスク: ${remainingTasks}`;
    
    // タスクが0件の場合
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-list">タスクはありません。新しいタスクを追加してください。</div>';
        return;
    }
    
    // タスクを画面に表示
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        // チェックボックス
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
        
        // タスクテキスト
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        // アクションボタンコンテナ
        const actionButtons = document.createElement('div');
        actionButtons.className = 'task-actions';
        
        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        actionButtons.appendChild(deleteBtn);
        
        // 要素を組み立てる
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(actionButtons);
        
        // タスクリストに追加
        taskList.appendChild(taskItem);
    });
}

// タスクの状態を切り替える関数
function toggleTaskStatus(id) {
    // 対象のタスクを見つけて状態を反転
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    // ローカルストレージに保存
    saveTasks();
    
    // タスクリストを更新
    renderTasks();
}

// タスクを削除する関数
function deleteTask(id) {
    // 削除の確認
    if (confirm('このタスクを削除してもよろしいですか？')) {
        // 対象のタスクを配列から削除
        tasks = tasks.filter(task => task.id !== id);
        
        // ローカルストレージに保存
        saveTasks();
        
        // タスクリストを更新
        renderTasks();
    }
}

// 完了したタスクをクリアする関数
function clearCompletedTasks() {
    // 完了したタスクが存在するか確認
    const hasCompletedTasks = tasks.some(task => task.completed);
    
    if (!hasCompletedTasks) {
        alert('完了したタスクはありません。');
        return;
    }
    
    // 削除の確認
    if (confirm('完了したタスクをすべて削除してもよろしいですか？')) {
        // 未完了のタスクのみを残す
        tasks = tasks.filter(task => !task.completed);
        
        // ローカルストレージに保存
        saveTasks();
        
        // タスクリストを更新
        renderTasks();
    }
}

// タスクをローカルストレージに保存する関数
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ローカルストレージからタスクを読み込む関数
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
