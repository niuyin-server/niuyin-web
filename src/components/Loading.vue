<template>
  <div class="Loading" :class="[isFullScreen ? 'full' : 'inline', type]">
    <div class="circle blue"></div>
    <div class="circle red"></div>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    isFullScreen: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'normal'
    }
  }
}
</script>

<style scoped lang="less">

.Loading {
  &.inline {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.small {
    .circle {
      width: 2rem;
      height: 2rem;
    }
  }

  &.full {
    z-index: 999;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
    width: 4rem;
  }

  .circle {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }

  .blue {
    background: var(---primary-blue-color);
    animation: anim-blue 0.4s ease-in-out 0s infinite alternate;
  }

  .red {
    background: var(---primary-red-color);
    animation: anim-red 0.4s ease-in-out 0s infinite alternate;
  }

  @keyframes anim-blue {
    from {
      transform: translate3d(0, 0, 0) scale(1);
    }
    to {
      transform: translate3d(2rem, 0, 0) scale(1.2);
    }
  }
  @keyframes anim-red {
    from {
      transform: translate3d(0, 0, 0) scale(1);
    }
    to {
      transform: translate3d(-2rem, 0, 0) scale(1.2);
    }
  }
}
</style>
