import React, {useState, useMemo} from 'react';
import '../styles/components/ExpensesCard.css';

const colores_categorias = {
    'Alimentacion': '#2563eb',
    'Transporte': '#10b981',
    'Vivienda': '#f59e0b',
    'Entretenimiento': '#ec4899',
    'Salud': '#8b5cf6',
    'Ropa': '#06b6d4',
    'Otros': '#64748b' //por si viene alguna categoria q no registramos
}

const paletaExtra = ['#84cc16', '#3b82f6', '#f43f5e', '#14b8a6', '#d946ef', '#f97316'];

// grafico
const DonutChart = ({data, total, hoveredItem, setHoveredItem}) => {
    let porcentajeAcumulado = 0;

    // formateador estandar para los pesos
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(val);
    };

    // determinamos que mostrar en el centro del grafico
    const centerLabel = hoveredItem ? hoveredItem.name.toUpperCase(): 'TOTAL GASTADO';
    const centerValue = hoveredItem ? hoveredItem.value: total;

    // no hay gastos registrados en la base de datos
    if(total === 0){
        return (
            <div className='chart-container'>
                <svg viewBox='0 0 42 42' className='donut-svg'>
                    <circle
                        cx='21'
                        cy='21'
                        r='15.9155'
                        fill='transparent'
                        stroke='#e2e8f0'
                        strokeWidth='2.5'
                    />
                </svg>
                <div className='donut-center-text'>
                    <span className='chart-label'>SIN GASTOS</span>
                    <span className='chart-total'>$0,00</span>
                </div>
            </div>
        );
    };

    // si hay gastos, el componente funciona normalmente
    return(
    <div className="chart-container">
        <svg viewBox="0 0 42 42" className="donut-svg">
        {data.map((item) => {
            const porcentaje = (item.value / total) * 100;
            const strokeDasharray = `${porcentaje} ${100 - porcentaje}`;
            const strokeDashoffset = 25 - porcentajeAcumulado;
            porcentajeAcumulado += porcentaje;
            const isHovered = hoveredItem?.id === item.id;

            return (
                <circle
                key={item.id}
                cx="21"
                cy="21"
                r="15.9155" /*este radio especifico hace que la circunferencia sea 100 exacto*/
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? "4" : "2.5"} /*resalta engrosando la linea si tiene hover*/
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                className="donut-slice"
                />
            );
        })}
        </svg>
            <div className='donut-center-text'>
                <span className='chart-label'>{centerLabel}</span>
                <span className='chart-total'>{formatCurrency(centerValue)}</span>
        </div>
    </div>
    );
};

// fila de lista de categorias
const LegendItem = ({item, hoveredItem, setHoveredItem}) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(val);
    };

    // si hay un elemento con hover y no es este, lo opacamos un poco
    const isDimmed = hoveredItem && hoveredItem.id !== item.id;

    return (
        <div className={`legend-item ${isDimmed ? 'dimmed' : ''}`} 
        onMouseEnter={() => setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}>
            <div className='legend-left'>
                <span className='legend-bullet' style={{backgroundColor: item.color}}></span>
                <span className='legend-name'>{item.name}</span>
            </div>    
                <span className='legend-value'>{formatCurrency(item.value)}</span>
        </div>
    );
};

// componente principal exportado
const ExpensesCard = ({data}) => {
    // estado para controlar donde esta el mouse
    const [hoveredItem, setHoveredItem] = useState(null);
    //procesamos la data usando useMemo
    const dataProcesada = useMemo(() => {
        if (!data || data.lenght === 0) return [];
        // filtramos que sea solo gastos
        const soloGastos = data.filter(item => item.tipo === 'gasto');
        const acumulador = {};
        soloGastos.forEach(item => {
            let nombreCategoria = item.categoria?.nombre_categoria || item.nombre_categoria;
            if (!nombreCategoria) nombreCategoria = 'Otros';
            if (!acumulador[nombreCategoria]){
                acumulador[nombreCategoria] = 0;
            }
            acumulador[nombreCategoria] += Number(item.monto || 0);
        });
        return Object.keys(acumulador).map((nombre, index)=> {
            let colorAsignado = colores_categorias[nombre];
            if (!colorAsignado){
                colorAsignado = paletaExtra[index % paletaExtra.length];
            }
            return{
                id: index,
                name: nombre,
                value: acumulador[nombre],
                color: colorAsignado
            };
        });
    }, [data]); // solo se calcula denuevo si la data cambia

    const totalExpenses = dataProcesada.reduce((sum, item) => sum + item.value, 0);
    return (
        <div className='expenses-card'>
            <h2 className='card-title'>Gastos por categoria</h2>
            <DonutChart data={dataProcesada} total={totalExpenses} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem}/>
            <div className='legend-list'>
                {dataProcesada.map((item) => (
                    <LegendItem key={item.id} item={item} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem}/>
                ))}
            </div>
        </div>
    );
};

export default ExpensesCard;