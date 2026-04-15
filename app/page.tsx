"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Truck,
  AlertTriangle,
  Percent,
  MessageCircle,
  ExternalLink,
  Shield,
  FileText,
  CreditCard,
  ArrowRight,
  Phone,
  Mail,
  Target,
  Handshake,
  Rocket,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ROICalculator() {
  const [mostrarSimulador, setMostrarSimulador] = useState(false)
  const [dadosLead, setDadosLead] = useState({ nome: "", email: "", telefone: "", empresa: "" })
  const [enviandoLead, setEnviandoLead] = useState(false)

  // Estados do simulador (mantidos da versão anterior)
  const [frota, setFrota] = useState(1000)
  const [percentualMultas, setPercentualMultas] = useState(40)
  const [ticketMedio, setTicketMedio] = useState(220)
  const [reducaoLW, setReducaoLW] = useState(20)
  const [custoPlaca, setCustoPlaca] = useState(7)
  const [planoSelecionado, setPlanoSelecionado] = useState("lite")

  const planos = {
    lite: {
      nome: "Lite",
      descricao: "Captura automática de infrações",
      detalhes: "Monitoramento completo das multas da sua frota com relatórios detalhados",
      valorMinimo: 7,
      cor: "bg-blue-400",
    },
    plus: {
      nome: "Plus",
      descricao: "Captura + Indicação de Condutores",
      detalhes: "Além da captura, identificamos automaticamente os condutores responsáveis",
      valorMinimo: 10,
      cor: "bg-blue-500",
    },
    premium: {
      nome: "Premium",
      descricao: "Captura + Indicação + Pagamento",
      detalhes: "Serviço completo: capturamos, indicamos e pagamos os autos para você",
      valorMinimo: 12,
      cor: "bg-blue-600",
    },
  }

  // Cálculos automáticos (mantidos da versão anterior)
  const [custoSemLW, setCustoSemLW] = useState(0)
  const [custoComLW, setCustoComLW] = useState(0)
  const [investimentoTotal, setInvestimentoTotal] = useState(0)
  const [economia, setEconomia] = useState(0)
  const [roiLiquido, setRoiLiquido] = useState(0)
  const [roiPercentual, setRoiPercentual] = useState(0)

  // Função para validar email
  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Função para validar telefone (formato brasileiro específico)
  const validarTelefone = (telefone: string) => {
    // Remove formatação para validar apenas os números
    const apenasNumeros = telefone.replace(/\D/g, "")
    // Valida se tem 10 ou 11 dígitos (DDD + número)
    return apenasNumeros.length === 10 || apenasNumeros.length === 11
  }

  // Função para formatar telefone automaticamente
  const formatarTelefone = (valor: string) => {
    // Remove tudo que não é dígito
    const apenasNumeros = valor.replace(/\D/g, "")

    // Limita a 11 dígitos
    const limitado = apenasNumeros.substring(0, 11)

    // Aplica a máscara conforme o tamanho
    if (limitado.length <= 2) {
      return limitado
    } else if (limitado.length <= 7) {
      return `(${limitado.substring(0, 2)}) ${limitado.substring(2)}`
    } else {
      return `(${limitado.substring(0, 2)}) ${limitado.substring(2, 7)}-${limitado.substring(7)}`
    }
  }

  // Função para enviar lead
  const enviarLead = async () => {
    if (!dadosLead.nome || !dadosLead.email || !dadosLead.telefone) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    if (!validarEmail(dadosLead.email)) {
      alert("Por favor, insira um email válido.")
      return
    }

    if (!validarTelefone(dadosLead.telefone)) {
      alert("Por favor, insira um telefone válido (ex: (41) 99999-9999).")
      return
    }

    setEnviandoLead(true)

    // Simular envio do lead (aqui você integraria com seu backend/email)
    try {
      // Exemplo de como seria o envio para um webhook ou API
      const leadData = {
        ...dadosLead,
        timestamp: new Date().toISOString(),
        origem: "Simulador ROI - Feira",
        ip: "IP_DO_USUARIO", // Seria capturado no backend
      }

      console.log("Lead capturado:", leadData)

      // Aqui você faria a chamada real para sua API
      // await fetch('/api/leads', { method: 'POST', body: JSON.stringify(leadData) })

      // Simular delay de envio
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMostrarSimulador(true)
    } catch (error) {
      alert("Erro ao processar seus dados. Tente novamente.")
    } finally {
      setEnviandoLead(false)
    }
  }

  // Função para lidar com mudança de plano (mantida da versão anterior)
  const handlePlanoChange = (novoPlano) => {
    setPlanoSelecionado(novoPlano)
    setCustoPlaca(planos[novoPlano].valorMinimo)
  }

  // UseEffect para cálculos (mantido da versão anterior)
  useEffect(() => {
    if (!mostrarSimulador) return

    if (percentualMultas < 20) setPercentualMultas(20)
    if (ticketMedio < 220) setTicketMedio(220)

    const valorMinimo = planos[planoSelecionado].valorMinimo
    if (custoPlaca < valorMinimo) {
      setCustoPlaca(valorMinimo)
    }

    const custoMensal = frota * (percentualMultas / 100) * ticketMedio
    setCustoSemLW(custoMensal)

    const economiaCalculada = custoMensal * (reducaoLW / 100)
    setEconomia(economiaCalculada)

    const custoComLWCalculado = custoMensal - economiaCalculada
    setCustoComLW(custoComLWCalculado)

    const investimento = frota * custoPlaca
    setInvestimentoTotal(investimento)

    const roiLiquidoCalculado = economiaCalculada - investimento
    setRoiLiquido(roiLiquidoCalculado)

    const roiPerc = custoMensal > 0 ? (roiLiquidoCalculado / custoMensal) * 100 : 0
    setRoiPercentual(roiPerc)
  }, [frota, percentualMultas, ticketMedio, reducaoLW, custoPlaca, planoSelecionado, mostrarSimulador])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  // Adicione este estilo CSS no início do componente, logo após os imports:
  const styles = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  
  .animate-scroll {
    animation: scroll 20s linear infinite;
  }
  
  .animate-scroll:hover {
    animation-play-state: paused;
  }
`

  // Landing Page de Captura de Leads
  if (!mostrarSimulador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header com Logo */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-white p-4 rounded-full shadow-2xl">
                <Calculator className="h-12 w-12 text-slate-800" />
              </div>
              <h1 className="text-5xl font-bold text-white">LW TECNOLOGIA</h1>
            </div>
            <h2 className="text-3xl font-semibold text-blue-200 mb-4">Gestão Inteligente de Multas</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Reduza até 85% dos custos com multas da sua frota com nossa tecnologia avançada de monitoramento e gestão
              automatizada
            </p>
          </div>

          {/* Produtos LW Multas */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-2xl bg-white/95 backdrop-blur border-0 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">LW Multas Lite</h3>
                <p className="text-slate-600 mb-4">Captura automática de infrações com monitoramento 24/7</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">A partir de R$ 7,00</div>
                <p className="text-sm text-slate-500">por placa/mês</p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-white/95 backdrop-blur border-0 hover:scale-105 transition-transform border-2 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">LW Multas Plus</h3>
                <p className="text-slate-600 mb-4">Captura + Indicação automática de condutores</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">A partir de R$ 10,00</div>
                <p className="text-sm text-slate-500">por placa/mês</p>
                <div className="mt-3">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    MAIS POPULAR
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-white/95 backdrop-blur border-0 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">LW Multas Premium</h3>
                <p className="text-slate-600 mb-4">Serviço completo: captura, indicação e pagamento</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">A partir de R$ 12,00</div>
                <p className="text-sm text-slate-500">por placa/mês</p>
              </CardContent>
            </Card>
          </div>

          {/* Portfólio de Produtos LW */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">NOSSO PORTFÓLIO COMPLETO</h3>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Soluções integradas para gestão completa da sua frota
              </p>
            </div>

            <Card className="shadow-2xl bg-white/95 backdrop-blur border-0">
              <CardContent className="p-8">
                <div className="flex justify-center">
                  <img
                    src="/images/lw-produtos-completo.png"
                    alt="Portfólio Completo LW Tecnologia - Soluções integradas para gestão de frotas"
                    className="max-w-full h-auto"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-slate-600 max-w-3xl mx-auto">
                    Oferecemos uma suíte completa de soluções para gestão de frotas: documentação, emplacamento, captura
                    de multas, indicações de condutor, pagamentos de infrações, consulta de débitos, rastreamento e
                    sistemas integrados para otimizar todos os processos da sua empresa.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefícios */}
          <Card className="shadow-2xl bg-white/95 backdrop-blur border-0 mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">Por que escolher a LW Tecnologia?</h3>
              <p className="text-slate-600 text-center mb-8 max-w-3xl mx-auto">
                Somos uma empresa conveniada junto ao RENAINF, que nos proporciona uma captura de 100% das infrações
                devidamente registradas no RENAINF. Estamos orgulhosos do impacto positivo que tivemos na gestão de
                frotas. Alguns números que definem nossa jornada:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white text-center">
                  <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-white mb-2">Mais de 25 anos</h4>
                  <p className="text-blue-100">de experiência no setor</p>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white text-center">
                  <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-white mb-2">Mais de 140</h4>
                  <p className="text-blue-100">clientes satisfeitos</p>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white text-center">
                  <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-white mb-2">Mais de 90%</h4>
                  <p className="text-blue-100">de redução na burocracia</p>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white text-center">
                  <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-white mb-2">Média de 95%</h4>
                  <p className="text-blue-100">de melhora da eficiência</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção de Clientes */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">CLIENTES QUE JÁ FIZERAM A ESCOLHA CERTA</h3>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Otimizamos processos e reduzimos custos com uma gestão de frotas eficiente
              </p>
            </div>

            {/* Carrossel de Logos */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur rounded-lg py-8">
              <div className="flex animate-scroll">
                {/* Primeira sequência de logos */}
                <div className="flex items-center justify-around min-w-full">
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">MOVIDA</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">UNIDAS</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">VOLVO</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">LOCALIZA</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">JSL</span>
                  </div>
                </div>

                {/* Segunda sequência (duplicada para efeito infinito) */}
                <div className="flex items-center justify-around min-w-full">
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">MOVIDA</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">UNIDAS</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">VOLVO</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">LOCALIZA</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mx-4 shadow-lg min-w-[150px] h-20 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-lg">JSL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Captura de Lead */}
          <Card className="shadow-2xl bg-white/95 backdrop-blur border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-center text-2xl">Calcule Gratuitamente o ROI da Sua Empresa</CardTitle>
              <CardDescription className="text-center text-blue-100">
                Descubra quanto você pode economizar com o LW Multas
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium text-slate-700">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={dadosLead.nome}
                    onChange={(e) => setDadosLead({ ...dadosLead, nome: e.target.value })}
                    className="text-lg border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa" className="text-sm font-medium text-slate-700">
                    Empresa
                  </Label>
                  <Input
                    id="empresa"
                    type="text"
                    placeholder="Nome da sua empresa"
                    value={dadosLead.empresa}
                    onChange={(e) => setDadosLead({ ...dadosLead, empresa: e.target.value })}
                    className="text-lg border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={dadosLead.email}
                      onChange={(e) => setDadosLead({ ...dadosLead, email: e.target.value })}
                      className="text-lg pl-10 border-slate-300 focus:border-blue-500"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-sm font-medium text-slate-700">
                    Telefone *
                  </Label>
                  <div className="relative">
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(41) 99999-9999"
                      value={dadosLead.telefone}
                      onChange={(e) => {
                        const valorFormatado = formatarTelefone(e.target.value)
                        setDadosLead({ ...dadosLead, telefone: valorFormatado })
                      }}
                      className="text-lg pl-10 border-slate-300 focus:border-blue-500"
                      maxLength={15}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  onClick={enviarLead}
                  disabled={enviandoLead}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 text-lg font-semibold shadow-lg"
                >
                  {enviandoLead ? (
                    "Processando..."
                  ) : (
                    <>
                      Acessar Simulador Gratuito
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-slate-500 mt-4">* Campos obrigatórios. Seus dados estão seguros conosco.</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-blue-200">
            <p>© 2024 LW Tecnologia - Gestão Inteligente de Multas</p>
          </div>
        </div>
      </div>
    )
  }

  // Simulador ROI (código mantido da versão anterior)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header com dados do lead */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <Calculator className="h-8 w-8 text-slate-800" />
            </div>
            <h1 className="text-4xl font-bold text-white">LW TECNOLOGIA</h1>
          </div>
          <h2 className="text-2xl font-semibold text-blue-200 mb-2">Calculadora de ROI - {dadosLead.nome}</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            {dadosLead.empresa && `${dadosLead.empresa} - `}
            Descubra quanto sua empresa pode economizar com nossos serviços de gestão de multas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de Entrada (mantido da versão anterior) */}
          <Card className="shadow-2xl bg-white/95 backdrop-blur border-0">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Dados da Sua Frota
              </CardTitle>
              <CardDescription className="text-blue-100">
                Insira os dados da sua empresa para calcular o ROI
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="frota" className="text-sm font-medium text-slate-700">
                  Total da Frota (veículos)
                </Label>
                <Input
                  id="frota"
                  type="number"
                  value={frota}
                  onChange={(e) => setFrota(Number(e.target.value))}
                  className="text-lg border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentual" className="text-sm font-medium text-slate-700">
                  % Média de Veículos que Recebem Multas por Mês
                </Label>
                <div className="relative">
                  <Input
                    id="percentual"
                    type="number"
                    value={percentualMultas}
                    min={20}
                    onChange={(e) => {
                      const valor = Number(e.target.value)
                      if (valor >= 20) {
                        setPercentualMultas(valor)
                      }
                    }}
                    className="text-lg pr-8 border-slate-300 focus:border-blue-500"
                  />
                  <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                {percentualMultas < 20 && <p className="text-xs text-red-500">Valor mínimo é 20%</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket" className="text-sm font-medium text-slate-700">
                  Ticket Médio por Multa
                </Label>
                <div className="relative">
                  <Input
                    id="ticket"
                    type="number"
                    value={ticketMedio}
                    min={220}
                    onChange={(e) => {
                      const valor = Number(e.target.value)
                      if (valor >= 220) {
                        setTicketMedio(valor)
                      }
                    }}
                    className="text-lg pl-8 border-slate-300 focus:border-blue-500"
                  />
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                {ticketMedio < 220 && <p className="text-xs text-red-500">Valor mínimo é R$ 220,00</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Pagamento com Desconto</Label>
                <Select value={reducaoLW.toString()} onValueChange={(value) => setReducaoLW(Number(value))}>
                  <SelectTrigger className="text-lg border-slate-300 focus:border-blue-500">
                    <SelectValue placeholder="Selecione o desconto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">Pagamento com 20% Desconto</SelectItem>
                    <SelectItem value="40">Pagamento com 40% Desconto</SelectItem>
                  </SelectContent>
                </Select>
                {reducaoLW === 40 && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                    <strong>Obs:</strong> Os 40% de desconto são aplicados via SNE (Sistema de Notificação Eletrônica)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custo" className="text-sm font-medium text-slate-700">
                  Investimento por Placa/Mês
                  <span className="text-xs text-slate-500 ml-2">
                    (A partir de R$ {planos[planoSelecionado].valorMinimo},00 para o plano{" "}
                    {planos[planoSelecionado].nome})
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="custo"
                    type="number"
                    value={custoPlaca}
                    min={planos[planoSelecionado].valorMinimo}
                    onChange={(e) => {
                      const valor = Number(e.target.value)
                      if (valor >= planos[planoSelecionado].valorMinimo) {
                        setCustoPlaca(valor)
                      }
                    }}
                    className="text-lg pl-8 border-slate-300 focus:border-blue-500"
                  />
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                {custoPlaca < planos[planoSelecionado].valorMinimo && (
                  <p className="text-xs text-red-500">
                    Valor mínimo para o plano {planos[planoSelecionado].nome} é R${" "}
                    {planos[planoSelecionado].valorMinimo},00
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-700">Escolha seu Plano LW Multas</Label>
                <div className="grid gap-3">
                  {Object.entries(planos).map(([key, plano]) => (
                    <div
                      key={key}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        planoSelecionado === key
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                      onClick={() => handlePlanoChange(key)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${plano.cor}`}></div>
                          <span className="font-bold text-lg text-slate-800">{plano.nome}</span>
                          <span className="text-sm text-slate-500">(a partir de R$ {plano.valorMinimo},00)</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            planoSelecionado === key ? "bg-blue-500 border-blue-500" : "border-slate-300"
                          }`}
                        >
                          {planoSelecionado === key && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                      <p className="font-medium text-slate-800 mb-1">{plano.descricao}</p>
                      <p className="text-sm text-slate-600">{plano.detalhes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados (mantidos da versão anterior) */}
          <div className="space-y-6">
            {/* Custos Mensais */}
            <Card className="shadow-2xl bg-white/95 backdrop-blur border-0">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Custos Mensais com Multas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="font-medium text-red-800">Sem a LW:</span>
                    <span className="text-xl font-bold text-red-600">{formatCurrency(custoSemLW)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="font-medium text-green-800">Com a LW:</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(custoComLW)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                    <span className="font-medium text-blue-800">Economia Mensal:</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(economia)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI */}
            <Card className="shadow-2xl bg-white/95 backdrop-blur border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Retorno sobre Investimento (ROI)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Investimento Mensal LW:</span>
                    <span className="text-lg font-semibold text-slate-800">{formatCurrency(investimentoTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border-2 border-green-300">
                    <span className="font-bold text-green-800">ROI Líquido Mensal:</span>
                    <span className="text-2xl font-bold text-green-700">{formatCurrency(roiLiquido)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                    <span className="font-bold text-blue-800">ROI Percentual:</span>
                    <span className="text-2xl font-bold text-blue-700">{formatPercent(roiPercentual)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo Anual */}
            <Card className="shadow-2xl bg-white/95 backdrop-blur border-0">
              <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle>Projeção Anual</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Economia Anual:</span>
                    <span className="font-bold text-green-600">{formatCurrency(economia * 12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Investimento Anual:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(investimentoTotal * 12)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold text-slate-800">ROI Líquido Anual:</span>
                    <span className="font-bold text-green-700 text-lg">{formatCurrency(roiLiquido * 12)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-8 shadow-2xl bg-white/95 backdrop-blur border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              {dadosLead.nome}, pronto para economizar {formatCurrency(economia)} por mês?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Com o plano {planos[planoSelecionado].nome} da LW Tecnologia, {dadosLead.empresa || "sua empresa"} pode{" "}
              {planos[planoSelecionado].descricao.toLowerCase()} e ter um ROI de {formatPercent(roiPercentual)} sobre o
              investimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center gap-2 shadow-lg"
                onClick={() =>
                  window.open(
                    `https://wa.me/5541926683150?text=Olá! Sou ${dadosLead.nome}${dadosLead.empresa ? ` da ${dadosLead.empresa}` : ""}. Vi na calculadora de ROI que posso economizar ${formatCurrency(economia)} por mês com o plano ${planos[planoSelecionado].nome}. Gostaria de saber mais!`,
                    "_blank",
                  )
                }
              >
                <MessageCircle className="h-5 w-5" />
                Falar no WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-600 hover:bg-slate-50 px-8 py-3 flex items-center gap-2 bg-white shadow-lg"
                onClick={() => window.open("https://lwtecnologia.com.br/", "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Visitar Nosso Site
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200">
          <p>© 2024 LW Tecnologia - Gestão Inteligente de Multas</p>
        </div>
      </div>
    </div>
  )
}
