function fun1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const a = Math.random
      if (a < 0.5) {
        reject('error')
      }
    }, 1000)
  })
}
async function fun2() {
  try {
    await fun1()
  } catch (error) {
    console.log('error')
  }
}

fun2()
