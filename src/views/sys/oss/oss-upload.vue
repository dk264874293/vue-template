<template>
  <el-dialog
    title="上传文件"
    :close-on-click-modal="false"
    :visible="visible"
    :show-close="false"
    :close-on-press-escape="false"
  >
    <el-upload
      drag
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      style="text-align: center;"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只支持jpg、png、gif格式的图片！</div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('refreshData')">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { baseURL } from '@/utils/request'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      url: '',
      num: 0,
      successNum: 0,
      fileList: []
    }
  },
  mounted() {
    this.url = baseURL + '/sys/oss/upload?token=' + this.$store.getters.token
  },
  methods: {
    // 上传之前
    beforeUploadHandle(file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.$message.error('只支持jpg、png、gif格式的图片！')
        return false
      }
      this.num++
    },
    // 上传成功
    successHandle(response, file, fileList) {
      this.fileList = fileList
      this.successNum++
      if (response && response.code === 0) {
        if (this.num === this.successNum) {
          this.$confirm('操作成功, 是否继续操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(() => {
          })
        }
      } else {
        this.$message.error(response.msg)
      }
    }
  }
}
</script>
