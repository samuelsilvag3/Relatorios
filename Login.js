import {By} from 'selenium-webdriver'

export class Login{

    async LoginSSW(driver){
        try{
            //sessao.LoginSSW()

            //Dados de Login
            let dominio = await driver.findElement(By.name('f1'))
            let cpf = await driver.findElement(By.name('f2'))
            let usuario = await driver.findElement(By.name('f3'))
            let senha = await driver.findElement(By.name('f4'))
            let BtnLogin = await driver.findElement(By.id('5'))

            dominio.sendKeys('ALL')
            cpf.sendKeys('33779439867')
            usuario.sendKeys('dsparcei')
            senha.sendKeys('123')

            await driver.manage().setTimeouts({implicit: 30000})
            BtnLogin.click()
            await driver.manage().setTimeouts({implicit: 30000})
            await driver.sleep(5000)
        }
        catch(err){
            console.log('erro2')
            console.log(err)
        }
        finally {
            //await driver.quit()
            console.log('FIM2')
        }
    }
}

export default Login