export async function validarFiltroAlerta(dados) {
    if (!dados.nome || dados.nome.trim() === '') {
        return { status: false, mensagem: 'Nome do filtro é obrigatório' };
    }
    
    if (dados.valor_minimo && dados.valor_maximo && dados.valor_minimo > dados.valor_maximo) {
        return { status: false, mensagem: 'Valor mínimo não pode ser maior que valor máximo' };
    }

    
    return { status: true, mensagem: '' };
}