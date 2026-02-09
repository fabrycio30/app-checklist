import Dexie, { type Table } from 'dexie';

export interface LocalInspection {
  id: string;
  equipmentId: string;
  templateId: string;
  answers: any;
  status: 'draft' | 'completed';
  createdAt: string;
  synced: number; // 0 = false, 1 = true
}

export interface LocalTemplate {
  id: string;
  name: string;
  questions: any[];
}

export interface LocalEquipment {
  id: string;
  plate: string;
  model: string;
  brand: string;
}

export class MySubClassedDexie extends Dexie {
  inspections!: Table<LocalInspection>;
  templates!: Table<LocalTemplate>;
  equipments!: Table<LocalEquipment>;

  constructor() {
    super('InspecaoTransulDB');
    
    // Versão 1 (Antiga - mantida para histórico, mas Dexie lida com upgrades)
    // this.version(1).stores({
    //   inspections: 'id, equipmentId, status, synced',
    //   templates: 'id',
    //   equipments: 'id, plate'
    // });

    // Versão 2: Adicionando createdAt ao índice de inspections
    this.version(2).stores({
      inspections: 'id, equipmentId, status, synced, createdAt',
      templates: 'id',
      equipments: 'id, plate'
    });
  }
}

export const db = new MySubClassedDexie();
