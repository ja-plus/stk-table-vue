import mitt from 'mitt';
import { DataType } from './types';

export const emitter = mitt<{
    'toggle-expand': DataType;
}>();
