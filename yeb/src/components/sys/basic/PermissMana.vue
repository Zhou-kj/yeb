<template lang="">
    <div>
        <!-- <div class="permissMannaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name" >
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input v-model="role.nameZh" size="small" placeholder="请输入角色中文名">
            </el-input>
            <el-button icon="el-icon-plus" type="primary" size="small" @click="">添加角色</el-button>
        </div> -->
        <div class="permissMannaMain">
            <el-collapse v-model="activeName" accordion @change="change">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r, index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>可访问资源</span>
                          <el-button style="float: right; padding: 3px 0; color: red;" type="text" icon="el-icon-delete"></el-button>
                        </div>
                        <div>
                            <el-tree ref="tree" :data="allMenus" :props="defaultProps" show-checkbox :default-checked-keys="selectMenus" node-key="id"></el-tree>
                            <div style="display:flex;justify-content:flex-end">
                                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="mini" type="primary" @click="doUpdate(r.id, index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
              </el-collapse>
        </div>
    </div>
</template>
<script>
    import router from '../../../router'
    import store from '../../../store/index'
    import { initMenu } from '../../../utils/menus'
export default {
    name: 'PermisManna',
    data() {
        return {
            role: {
                name: '',
                nameZh: ''
            },
            roles: [],
            allMenus: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            selectMenus: [],
            activeName: -1,
        }
    },
    mounted(){
        this.initRoles()
    },
    methods: {
        cancelUpdate() {
            this.activeName = -1
        },
        doUpdate(rid, index) {
            let selectKeys = this.$refs.tree[index].getCheckedKeys(true)
            let data = new Object()
            data.rid = rid
            data.mids = selectKeys
            console.log('data:', data)
            this.putRequest('/system/basic/permiss', data).then(resp => {
                if (resp) {
                    this.initRoles()
                    this.initSelectMuens(rid)
                    this.activeName = -1
                    store.state.routes.length = 0
                    initMenu(router, store)
                }
            })
        },
        initSelectMuens(rid) {
            this.getRequest('/system/basic/permiss/mid?rid='+rid).then(resp => {
                if (resp) {
                    this.selectMenus = resp
                }
            })
        },
        change(rid) {
            if (rid) {
                this.initAllMenus()
                this.initSelectMuens(rid)
            }
        },
        initAllMenus() {
            this.getRequest('/system/basic/permiss/menus').then(resp => {
                if (resp) {
                    this.allMenus = resp
                }
            })
        },
        initRoles() {
            this.getRequest('/system/basic/permiss').then(resp => {
                if (resp) {
                    this.roles = resp
                }
            })
        }
    }
}
</script>
<style scoped>
    .permissMannaTool{
        display: flex;
        justify-content: flex-start;
    }

    .permissMannaTool .el-input {
        width: 300px;
        margin-right: 6px;
    }
    .permissMannaMain{
        margin-top: 10px;
        width: 700px;
    }
</style>