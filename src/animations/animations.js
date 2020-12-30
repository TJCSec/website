const fadeInUp = ({duration, y} = {}) => ({
  initial: {
    y: y ?? 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration,
    }
  },
  exit: {
    y: y ?? 20,
    opacity: 0,
  }
})

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export {
  fadeInUp,
  stagger
}
