<template lang="">
    <div style="width: 500px;">
        <el-input
        placeholder="输入部门名称进行搜索"
        prefix-icon="el-icon-search"
        v-model="filterText">
      </el-input>
      
      <el-tree
        :data="deps"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }" style="display: flex; justify-content: space-between; width: 100%">
            <span>{{ data.name }}</span>
            <span>
              <el-button
                type="primary"
                size="mini"
                class="depBtn"
                @click="() => addDep(data)">
                添加
              </el-button>
              <el-button
                type="danger"
                size="mini"
                class="depBtn"
                @click="() => delDep(data)">
                删除
              </el-button>
            </span>
          </span>
      </el-tree>
      <el-dialog
      title="添加部门"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        <table>
            <tr>
                <td>
                    <el-tag>上级部门</el-tag>
                </td>
                <td>{{pname}}</td>
            </tr>
            <tr>
                <td>
                    <el-tag>部门名称</el-tag>
                </td>
                <td>
                    <el-input v-model="dep.name" placeholder="请输入部门名称" size="normal" clearable @change=""></el-input>
                    
                </td>
            </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toAdd">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'DepMana',
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
        return {
            pname:'',
            dep:{
                name: '',
                parentId: -1
            },
            dialogVisible: false,
            filterText:'',
            deps: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    mounted() {
        this.initDeps()
    },
    methods: {
        initDep() {
            this.dep = {
                name: '',
                parentId: -1
            }
            this.pname = ''
        },  
        // addDepAfter(deps, dep) {
        //     for (let i = 0 ; i < deps.length ; i ++) {
        //         let d = deps[i]
        //         if (d.id == dep.parentId) {
        //             d.children = d.children.concat(dep)
        //                 return
        //         } else {
        //             this.addDepAfter(d.children, dep)
        //      }
        //     }
        // },  
        toAdd(){
            this.postRequest('/system/basic/department', this.dep).then(resp => {
                if (resp) {
                    this.initDeps()
                    this.initDep()
                    this.dialogVisible = false
                }
            })
        },
        addDep(data) {
            this.pname = data.name
            this.dep.parentId = data.id
            this.dialogVisible = true
        },
        delDep(data) {
            this.$confirm('确认删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.deleteRequest('/system/basic/department', data).then(resp => {
                if (resp) {
                    this.initDep()
                    this.initDeps()
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })    
        })
        },
        initDeps(val) {
            this.getRequest('/system/basic/department').then(resp => {
                if (resp) {
                    this.deps = resp
                }
            })
        },
        filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    }
}
</script>
<style scoped>
    .depBtn {
        padding: 2px;
    }
</style>