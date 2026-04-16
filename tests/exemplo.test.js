import { describe, it, expect, beforeEach } from 'vitest';
import {
   addTask,
  removeTask,
  filterTasks,
  toggleTask,
  countTasks,
  countCompleted,
  countPending,
  resetId,
} from '../src/taskManager.js';

// Exercício 1: removeTask

describe('removeTask', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
  });

  it('deve remover uma tarefa pelo ID', () => {
    const updated = removeTask(tasks, 2);
    expect(updated).toHaveLength(2);
    expect(updated.find((t) => t.id === 2)).toBeUndefined();
  });

  it('deve manter as outras tarefas intactas', () => {
    const updated = removeTask(tasks, 2);
    expect(updated[0].title).toBe('Tarefa 1');
    expect(updated[1].title).toBe('Tarefa 3');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const updated = removeTask(tasks, 1);
    expect(updated).not.toBe(tasks);
    expect(tasks).toHaveLength(3);
  });

  it('deve retornar a lista completa se o ID não existir', () => {
    const updated = removeTask(tasks, 999);
    expect(updated).toHaveLength(3);
  });

  it('deve retornar array vazio ao remover de lista vazia', () => {
    const updated = removeTask([], 1);
    expect(updated).toHaveLength(0);
  });
});

// Exercício 2: filterTasks

describe('filterTasks', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
    tasks = tasks.map((t) => (t.id === 2 ? toggleTask(t) : t));
  });

  it('deve retornar todas as tarefas com filtro "all"', () => {
    expect(filterTasks(tasks, 'all')).toHaveLength(3);
  });

  it('deve retornar apenas pendentes com filtro "pending"', () => {
    const result = filterTasks(tasks, 'pending');
    expect(result).toHaveLength(2);
    result.forEach((t) => expect(t.completed).toBe(false));
  });

  it('deve retornar apenas concluídas com filtro "completed"', () => {
    const result = filterTasks(tasks, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

  it('deve retornar todas para filtro desconhecido', () => {
    expect(filterTasks(tasks, 'invalido')).toHaveLength(3);
  });

  it('deve retornar array vazio para lista vazia', () => {
    expect(filterTasks([], 'all')).toHaveLength(0);
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    expect(filterTasks(tasks, 'all')).not.toBe(tasks);
  });
});

//Exercício 3: Contagens

describe('countTasks', () => {
  it('deve retornar 0 para lista vazia', () => {
    expect(countTasks([])).toBe(0);
  });

  it('deve retornar o total de tarefas', () => {
    resetId();
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    expect(countTasks(tasks)).toBe(2);
  });
});

describe('countCompleted', () => {
  beforeEach(() => { resetId(); });

  it('deve retornar 0 para lista vazia', () => {
    expect(countCompleted([])).toBe(0);
  });

  it('deve contar as tarefas concluídas', () => {
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = tasks.map((t) => (t.id === 1 ? toggleTask(t) : t));
    expect(countCompleted(tasks)).toBe(1);
  });

  it('deve retornar 0 quando nenhuma está concluída', () => {
    let tasks = addTask([], 'Tarefa A');
    expect(countCompleted(tasks)).toBe(0);
  });
});

describe('countPending', () => {
  beforeEach(() => { resetId(); });

  it('deve retornar 0 para lista vazia', () => {
    expect(countPending([])).toBe(0);
  });

  it('deve contar as tarefas pendentes', () => {
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = tasks.map((t) => (t.id === 1 ? toggleTask(t) : t));
    expect(countPending(tasks)).toBe(1);
  });

  it('deve retornar 0 quando todas estão concluídas', () => {
    let tasks = addTask([], 'Tarefa A');
    tasks = tasks.map((t) => toggleTask(t));
    expect(countPending(tasks)).toBe(0);
  });
});

// Exercício 4: Prioridade

describe('validatePriority', () => {
  it('deve retornar true para "low"', () => {
    expect(validatePriority('low')).toBe(true);
  });

  it('deve retornar true para "medium"', () => {
    expect(validatePriority('medium')).toBe(true);
  });

  it('deve retornar true para "high"', () => {
    expect(validatePriority('high')).toBe(true);
  });

  it('deve retornar false para valor inválido', () => {
    expect(validatePriority('urgente')).toBe(false);
  });

  it('deve retornar false para string vazia', () => {
    expect(validatePriority('')).toBe(false);
  });

  it('deve retornar false para null', () => {
    expect(validatePriority(null)).toBe(false);
  });
});
describe('createTask com prioridade', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar tarefa com prioridade "high"', () => {
    const task = createTask('Tarefa urgente', 'high');
    expect(task).toHaveProperty('priority', 'high');
  });

  it('deve usar "medium" como prioridade padrão', () => {
    const task = createTask('Tarefa normal');
    expect(task).toHaveProperty('priority', 'medium');
  });

  it('deve criar tarefa com prioridade "low"', () => {
    const task = createTask('Tarefa baixa', 'low');
    expect(task).toHaveProperty('priority', 'low');
  });
});

describe('filterByPriority', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = [
      createTask('Tarefa alta', 'high'),
      createTask('Tarefa media', 'medium'),
      createTask('Tarefa baixa', 'low'),
      createTask('Outra alta', 'high'),
    ];
  });

  it('deve retornar apenas tarefas de prioridade "high"', () => {
    const result = filterByPriority(tasks, 'high');
    expect(result).toHaveLength(2);
    result.forEach((t) => expect(t.priority).toBe('high'));
  });

  it('deve retornar apenas tarefas de prioridade "medium"', () => {
    const result = filterByPriority(tasks, 'medium');
    expect(result).toHaveLength(1);
  });

  it('deve retornar apenas tarefas de prioridade "low"', () => {
    const result = filterByPriority(tasks, 'low');
    expect(result).toHaveLength(1);
  });

  it('deve retornar array vazio para lista vazia', () => {
    expect(filterByPriority([], 'high')).toHaveLength(0);
  });

  it('deve retornar array vazio para prioridade inexistente', () => {
    expect(filterByPriority(tasks, 'urgente')).toHaveLength(0);
  });
});