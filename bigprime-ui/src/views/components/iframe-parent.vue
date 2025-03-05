<template>
  <div ref="iframeContainer" style="height: 100%; width: 100%">
  </div>
</template>

<script setup lang="ts">
import {ref, watchEffect} from 'vue'
import {cloneDeep, isEmpty} from "lodash-es"
import {getDomain, getToken} from "@/utils/token"
import useLocale from "@/hooks/locale"
import emitter from "@/utils/evnetbus"
import { TinyLoading } from '@opentiny/vue'

const {getLocale} = useLocale()

type serverType = 'das' | 'dsp';
const serverName = defineModel<serverType>('serverName')
const componentPath = defineModel('componentPath')
const data = defineModel<any>('data')
const url = ref('')

const iframeContainer = ref<HTMLDivElement | null>(null);

const createIframe = () => {
  if (iframeContainer.value) {
    const iframe = document.createElement('iframe');
    iframe.id = "myIframe";
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = url.value;
    iframe.onload = iframeLoaded;
    iframeContainer.value.appendChild(iframe);
  }
};

const iframeLoaded = () => {
  const iframe: any = document.querySelector('#myIframe')
  let params = {
    key: 'bigprime-iframe',
    token: getToken(),
    lange: getLocale(),
    componentPath: cloneDeep(componentPath.value),
    data: cloneDeep(data.value)
  }
  iframe?.contentWindow?.postMessage(params, '*')
}
watchEffect(() => {
  if (!isEmpty(serverName.value)) {
    const domain = getDomain(serverName.value)
    url.value = `${domain}#/iframe/page`
    if (iframeContainer.value && iframeContainer.value.firstChild) {
      iframeContainer.value.removeChild(iframeContainer.value.firstChild);
    }
    createIframe()
  }
})
const langeChange = () => {
  const iframe: any = document.querySelector('#myIframe')
  let params = {
    key: 'bigprime-iframe',
    lange: getLocale()
  }
  iframe?.contentWindow?.postMessage(params, '*')
}
emitter.on('langeChange', langeChange)


</script>
<style scoped lang="less">
.iframe-css {
  height: 100%;
  width: 100%;
  border: none;
}
.my-custom-loading-fullscreen .tiny-loading__spinner > .tiny-svg.circular {
  fill: #fff;
}
.my-custom-loading-fullscreen .tiny-loading__spinner > .tiny-loading__text {
  color: #fff;
}
</style>
