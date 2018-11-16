<template>
    <el-dialog title="自定义列" :visible="show" :show-close="false">
        <label class="title"><a @click="onSetAll" href="javascript:;">全选 </a> | <a @click="onSetDefault" href="javascript:;"> 默认</a></label>
        <el-checkbox-group v-model="fields">
            <template v-if="renderByClass">
                <el-checkbox v-for="item in allFields" :label="item.fieldName" :key="item.fieldName">{{item.text}}</el-checkbox>
            </template>

            <template v-else>
                <el-checkbox v-for="item in allFields" :label="item.NO" :key="item.NO">{{item.text}}</el-checkbox>
            </template>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onConfirm" size="small">确定</el-button>
            <el-button @click="onCancel" size="small">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>

/*
th、td属性：
    alwaysShow 列一直显示，自定义列里不会出现
props: 
    relatedTableClass 要绑定的table的className
    cacheName 要读写的localStorage名
    renderByClass 通过数据列class名渲染，主要针对存在合并单元格的情况
    defaultChecked 默认展示数据列
调用方法：
    获取数据后
    this.$nextTick(() => {
        this.$refs.tableCustomModal.init();
    });
    触发重新渲染表格
*/

export default {
    data () {
        return {
           show: false,
           fields: [],
           allFields: [],
           $relatedTable: null,
           alwaysShowCount: 0
        }
    },

    props: [
        'relatedTableClass',
        'cacheName',
        'renderByClass',
        'defaultChecked'
    ],

    methods: {
        init () {
            this.$relatedTable = $('.' + this.relatedTableClass);
            let cookie = localStorage.getItem(this.cacheName);
            if(cookie) {
                if(this.renderByClass) {
                    this.fields = cookie.split('|');
                } else {
                    this.fields = _.map(cookie.split('|'), item => {
                        return parseInt(item);
                    });
                }
            } else {
                this.fields = this.defaultChecked;
            }

            this.renderFields();
            this.renderTable();
        },

        showModal () {
            this.show = true;
            this.init();
        },

        renderFields () {
            this.allFields = [];
            _.each(this.$relatedTable.find('thead tr th'), (item, index) => {
                let alwaysShow = $(item)[0].hasAttribute('alwaysShow');
                if(this.renderByClass) {
                    let classNames = $(item).attr('class') ? $(item).attr('class').split(' ')[0] : '',
                        fieldName = classNames.split('-')[1];
                    if(alwaysShow) {
                        this.alwaysShowCount ++;
                    } else {
                        fieldName && this.allFields.push({
                            fieldName: fieldName,
                            text: item.innerText,
                            alwaysShow: alwaysShow
                        });
                    }
                } else {
                    if(alwaysShow) {
                        this.alwaysShowCount ++;
                    } else {
                        this.allFields.push({
                            NO: index,
                            text: item.innerText,
                            alwaysShow: alwaysShow
                        });
                    }
                }
            });
        },

        onCancel () {
            this.show = false;
        },

        onConfirm () {
            this.renderTable();
            localStorage.setItem(this.cacheName, this.fields.join('|'), {
                expires: 60 * 60 * 24 * 365
            });

            this.show = false;
        },

        renderTable () {
            //全部隐藏
            _.each(this.$relatedTable.find('th, td'), item => {
                let alwaysShow = !!$(item).attr('alwaysShow');
                if(this.renderByClass) {
                    if($(item).attr('class') && /field-/.test($(item).attr('class'))) {
                        !alwaysShow && $(item).hide();
                    }
                } else {
                    !alwaysShow && $(item).hide();
                }
            });

           //显示
            _.each(this.fields, item => {
                if(this.renderByClass) {
                    this.$relatedTable.find('thead th.field-' + item).show();
                    _.each(this.$relatedTable.find('tbody').find('tr'), tr => {
                        $(tr).find('td.field-' + item).show();
                    });
                } else {
                    this.$relatedTable.find('thead th').eq(parseInt(item)).show();
                    _.each(this.$relatedTable.find('tbody').find('tr'), tr => {
                        $(tr).find('td').eq(parseInt(item)).show();
                    });
                }
            });
        },

        onSetAll () {
            if(this.renderByClass) {
                this.fields = _.map(this.allFields, 'fieldName');
            } else {
                this.fields = _.range(0, this.allFields.length + this.alwaysShowCount);
            }
        },

        onSetDefault () {
            this.fields = this.defaultChecked;
        }
    }
}
</script>

<style>
	.title {
        display: inline-block;
        margin-bottom: 10px;
    }
    .title a {
		text-decoration: none;
    }
    .el-checkbox+.el-checkbox {
        margin-left: 0;
    }
    .el-checkbox {
        margin-left: 0;
        min-width: 120px;
        white-space: nowrap;
    }
</style>