import {Builder, Browser, By, until} from 'selenium-webdriver'
import Login from './Login.js'
import ConfiguraRel from './ConfiguraRel.js'
import Fila from './FIla.js'
import Coletas from './Coletas.js'
import Arquivos from './Arquivos.js'
import chrome from 'selenium-webdriver/chrome.js'

async function relatorios(){
    let login = new Login()
    let config = new ConfiguraRel()
    let FilaRel = new Fila()
    let coletas = new Coletas()
    let filehandler = new Arquivos()

    let prefs = {"download.default_directory": "Y:\\Mural"}
    let diretorio = 'Y:/Mural'
    let nomeentregas = 'entregas.csv'
    let nomecoletas = 'coletas.csv'

    let opts = new chrome.Options()
    opts.setUserPreferences(prefs)
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(opts).build()
    
    try{
      //Apaga arquivos gerados anteriormente
      await filehandler.limpadiretorio('Y:/Mural')

      //Realiza Login no SSW
      await driver.get('https://sistema.ssw.inf.br/bin/ssw0422')
      const JanelaInicial = await driver.getWindowHandle()
      await login.LoginSSW(driver)
      await driver.wait(until.titleIs('Menu Principal :: SSW Sistema de Transportes'), 30000)

      //Acessar gerador de relatorios de CTE emitidos
      let opcao = await driver.findElement(By.xpath('//*[@id="3"]'))
      opcao.sendKeys('455')
      await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 30000)

      //Laço 02 meses
      //Troca para nova janela aberta
      let janelas = await driver.getAllWindowHandles()
      janelas.forEach(async handle => {
        if(handle !== JanelaInicial){
          await driver.switchTo().window(handle)
        }
      })

      //Configura Filtros do Relatorio
      await driver.wait(until.titleIs('455 - Fretes Expedidos/Recebidos - CTRCs :: SSW Sistema de Transportes'), 30000)
      let jan455 = await driver.getWindowHandle()
      await config.GeraRel(driver)

      //Acessa fila de espera
      await driver.switchTo().window(JanelaInicial)
      await driver.wait(until.titleIs('Menu Principal :: SSW Sistema de Transportes'), 30000)
      opcao.sendKeys('156')
      await driver.wait(async () => (await driver.getAllWindowHandles()).length === 3, 2000)

      //Muda foco para janela da fila de espera
      janelas = await driver.getAllWindowHandles()
      janelas.forEach(async handle => {
        if((handle !== JanelaInicial) && (handle !== jan455)){
          await driver.switchTo().window(handle)
        }
      })

      await driver.wait(until.titleIs('156 - Fila de processamento em lotes :: SSW Sistema de Transportes'), 30000)
      let jan156 = await driver.getWindowHandle()
      await FilaRel.FilaProcessamento(driver)

      filehandler.renomeiaarquivos(diretorio, nomeentregas)

      //Retorna ao menu principal
      await driver.switchTo().window(JanelaInicial)
      await driver.wait(until.titleIs('Menu Principal :: SSW Sistema de Transportes'), 30000)

      //Acessa Situação das coletas
      opcao.sendKeys('103')
      await driver.wait(async () => (await driver.getAllWindowHandles()).length === 4, 30000)
      janelas = await driver.getAllWindowHandles()
      janelas.forEach(async handle => {
        if((handle !== JanelaInicial) && (handle !== jan455) && (handle !== jan156)){
          await driver.switchTo().window(handle)
        }
      })
      await driver.wait(until.titleIs('103 - Situação de Coletas :: SSW Sistema de Transportes'), 30000)
      await coletas.GeraColetas(driver)
      await driver.sleep(7000)
      filehandler.renomeiaarquivos(diretorio, nomecoletas)
      await driver.sleep(5000)
    }
    catch(err){
        console.log('erro')
        console.log(err)
      }
      finally{
        console.log('Finally!!!')
        await driver.quit()
      }
}

relatorios()