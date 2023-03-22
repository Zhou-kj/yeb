<template lang="">
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="部门管理" name="DepManna"><DepManna></DepManna></el-tab-pane></el-tab-pane>
            <el-tab-pane label="职位管理" name="PosMana"><PosMana></PosMana></el-tab-pane>
            <el-tab-pane label="职称管理" name="JobLevelMana"><JobLevelMana></JobLevelMana></el-tab-pane>
            <el-tab-pane label="权限组" name="PermissManna"><PermissManna></PermissManna></el-tab-pane>
          </el-tabs>
    </div>
</template>
<script>
import DepManna from '../../components/sys/basic/DepMana.vue'
import PermissManna from '../../components/sys/basic/PermissMana.vue'
import JobLevelMana from '../../components/sys/basic/JobLevelMana'
import PosMana from '../../components/sys/basic/PosMana'

export default {
    name: 'SysBasic',
    data() {
        return {
            activeName: 'DepManna'
        }
    },
    components: {
        DepManna,
        PermissManna,
        JobLevelMana,
        PosMana
    }
}
</script>
<style scoped>
    
</style>