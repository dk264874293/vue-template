<template>
  <el-dialog
    title="云存储配置"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="false"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item size="mini" label="存储类型">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">七牛</el-radio>
          <el-radio :label="2">阿里云</el-radio>
          <el-radio :label="3">腾讯云</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.type === 1">
        <el-form-item label="域名">
          <el-input v-model="dataForm.qiniuDomain" placeholder="七牛绑定的域名" />
        </el-form-item>
        <el-form-item label="路径前缀">
          <el-input v-model="dataForm.qiniuPrefix" placeholder="不设置默认为空" />
        </el-form-item>
        <el-form-item label="AccessKey">
          <el-input v-model="dataForm.qiniuAccessKey" placeholder="七牛AccessKey" />
        </el-form-item>
        <el-form-item label="SecretKey">
          <el-input v-model="dataForm.qiniuSecretKey" placeholder="七牛SecretKey" />
        </el-form-item>
        <el-form-item label="空间名">
          <el-input v-model="dataForm.qiniuBucketName" placeholder="七牛存储空间名" />
        </el-form-item>
      </template>
      <template v-else-if="dataForm.type === 2">
        <el-form-item label="域名">
          <el-input v-model="dataForm.aliyunDomain" placeholder="阿里云绑定的域名" />
        </el-form-item>
        <el-form-item label="路径前缀">
          <el-input v-model="dataForm.aliyunPrefix" placeholder="不设置默认为空" />
        </el-form-item>
        <el-form-item label="EndPoint">
          <el-input v-model="dataForm.aliyunEndPoint" placeholder="阿里云EndPoint" />
        </el-form-item>
        <el-form-item label="AccessKeyId">
          <el-input v-model="dataForm.aliyunAccessKeyId" placeholder="阿里云AccessKeyId" />
        </el-form-item>
        <el-form-item label="AccessKeySecret">
          <el-input v-model="dataForm.aliyunAccessKeySecret" placeholder="阿里云AccessKeySecret" />
        </el-form-item>
        <el-form-item label="BucketName">
          <el-input v-model="dataForm.aliyunBucketName" placeholder="阿里云BucketName" />
        </el-form-item>
      </template>
      <template v-else-if="dataForm.type === 3">
        <el-form-item label="域名">
          <el-input v-model="dataForm.qcloudDomain" placeholder="腾讯云绑定的域名" />
        </el-form-item>
        <el-form-item label="路径前缀">
          <el-input v-model="dataForm.qcloudPrefix" placeholder="不设置默认为空" />
        </el-form-item>
        <el-form-item label="AppId">
          <el-input v-model="dataForm.qcloudAppId" placeholder="腾讯云AppId" />
        </el-form-item>
        <el-form-item label="SecretId">
          <el-input v-model="dataForm.qcloudSecretId" placeholder="腾讯云SecretId" />
        </el-form-item>
        <el-form-item label="SecretKey">
          <el-input v-model="dataForm.qcloudSecretKey" placeholder="腾讯云SecretKey" />
        </el-form-item>
        <el-form-item label="BucketName">
          <el-input v-model="dataForm.qcloudBucketName" placeholder="腾讯云BucketName" />
        </el-form-item>
        <el-form-item label="Bucket所属地区">
          <el-input v-model="dataForm.qcloudRegion" placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）" />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('visibleChange')">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSysOssConfig, setSysOssSaveConfig } from '@/api/sys'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataForm: {
        qiniuDomain: '',
        qiniuPrefix: '',
        qiniuAccessKey: '',
        qiniuSecretKey: '',
        qiniuBucketName: '',
        aliyunDomain: '',
        aliyunPrefix: '',
        aliyunEndPoint: '',
        aliyunAccessKeyId: '',
        aliyunAccessKeySecret: '',
        aliyunBucketName: '',
        qcloudDomain: '',
        qcloudPrefix: '',
        qcloudAppId: '',
        qcloudSecretId: '',
        qcloudSecretKey: '',
        qcloudBucketName: '',
        qcloudRegion: ''
      },
      dataRule: {}
    }
  },
  watch: {
    visible(newData, oldData) {
      if (newData) {
        getSysOssConfig()
          .then(({ data }) => {
            this.dataForm = data && data.code === 0 ? { ...data.config } : {
              qiniuDomain: '',
              qiniuPrefix: '',
              qiniuAccessKey: '',
              qiniuSecretKey: '',
              qiniuBucketName: '',
              aliyunDomain: '',
              aliyunPrefix: '',
              aliyunEndPoint: '',
              aliyunAccessKeyId: '',
              aliyunAccessKeySecret: '',
              aliyunBucketName: '',
              qcloudDomain: '',
              qcloudPrefix: '',
              qcloudAppId: '',
              qcloudSecretId: '',
              qcloudSecretKey: '',
              qcloudBucketName: '',
              qcloudRegion: ''
            }
          })
      }
    }
  },
  methods: {
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          setSysOssSaveConfig(this.dataForm)
            .then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$emit('visibleChange')
                }
              })
            })
        }
      })
    }
  }
}
</script>

