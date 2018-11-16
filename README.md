
## 说明：
th、td属性：

    alwaysShow 列一直显示，自定义列里不会出现

props: 

    relatedTableClass 要绑定的table的className

    cacheName 要读写的localStorage名

    renderByClass 通过数据列class名渲染，主要针对存在合并单元格的情况

    defaultChecked 默认展示数据列

调用方法：

    获取数据后，触发重新渲染表格

```js
    this.$nextTick(() => {
        this.$refs.tableCustomModal.init();
    });
``` 

## 使用

```html
<el-button type="primary" size="small" @click="onCustomTable"><i class="el-icon-setting"></i></el-button>
```

```js
methods: {
	getData () {
		getRemoteData.then(res => {
			this.list = res.list;

			this.$nextTick(() => {
		        this.$refs.tableCustomModal.init();
		    });
		});		
	},
	
	onCustomTable () {
		this.$refs.tableCustomModal.showModal();
	}
}
```
