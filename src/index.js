import TableColumnsCustom from './TableColumnsCustom.vue';

export default TableColumnsCustom;

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.component('table-columns-custom', TableColumnsCustom);
}