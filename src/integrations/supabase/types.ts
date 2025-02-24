export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calculadora_cmv: {
        Row: {
          cmv_percentual: number
          cmv_valor: number
          created_at: string
          faturamento_real: number
          id: string
          lucro_perdido: number
          updated_at: string
          user_email: string
        }
        Insert: {
          cmv_percentual: number
          cmv_valor: number
          created_at?: string
          faturamento_real: number
          id?: string
          lucro_perdido: number
          updated_at?: string
          user_email: string
        }
        Update: {
          cmv_percentual?: number
          cmv_valor?: number
          created_at?: string
          faturamento_real?: number
          id?: string
          lucro_perdido?: number
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      categorias_insumos: {
        Row: {
          contabiliza_cmv: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          contabiliza_cmv?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          contabiliza_cmv?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      categorias_produtos: {
        Row: {
          atualizado_em: string
          criado_em: string
          deleted_at: string | null
          id: string
          inativo: boolean | null
          nome: string
          pizzaria_id: string
          tipo: Database["public"]["Enums"]["tipo_produto"]
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          deleted_at?: string | null
          id?: string
          inativo?: boolean | null
          nome: string
          pizzaria_id: string
          tipo?: Database["public"]["Enums"]["tipo_produto"]
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          deleted_at?: string | null
          id?: string
          inativo?: boolean | null
          nome?: string
          pizzaria_id?: string
          tipo?: Database["public"]["Enums"]["tipo_produto"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_categorias_pizzaria"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_produtos_acabados: {
        Row: {
          created_at: string
          deleted_at: string | null
          descricao: string | null
          id: string
          inativo: boolean | null
          nome: string
          pizzaria_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          inativo?: boolean | null
          nome: string
          pizzaria_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          inativo?: boolean | null
          nome?: string
          pizzaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_produtos_acabados_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_produtos_ordem: {
        Row: {
          categoria_id: string
          created_at: string
          id: string
          ordem: number
          pizzaria_id: string
          tipo: string
          updated_at: string
        }
        Insert: {
          categoria_id: string
          created_at?: string
          id?: string
          ordem: number
          pizzaria_id: string
          tipo: string
          updated_at?: string
        }
        Update: {
          categoria_id?: string
          created_at?: string
          id?: string
          ordem?: number
          pizzaria_id?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_categoria"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pizzaria"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      contagens_estoque: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          finalizado_por: string | null
          id: string
          iniciado_por: string
          observacoes: string | null
          pizzaria_id: string
          status: Database["public"]["Enums"]["contagem_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          finalizado_por?: string | null
          id?: string
          iniciado_por: string
          observacoes?: string | null
          pizzaria_id: string
          status?: Database["public"]["Enums"]["contagem_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          finalizado_por?: string | null
          id?: string
          iniciado_por?: string
          observacoes?: string | null
          pizzaria_id?: string
          status?: Database["public"]["Enums"]["contagem_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contagens_estoque_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      contagens_estoque_itens: {
        Row: {
          contado_por: string
          contagem_id: string
          created_at: string
          diferenca: number | null
          id: string
          insumo_id: string | null
          observacoes: string | null
          produto_id: string | null
          quantidade_anterior: number | null
          quantidade_contada: number
          tipo_item: string
          updated_at: string
        }
        Insert: {
          contado_por: string
          contagem_id: string
          created_at?: string
          diferenca?: number | null
          id?: string
          insumo_id?: string | null
          observacoes?: string | null
          produto_id?: string | null
          quantidade_anterior?: number | null
          quantidade_contada: number
          tipo_item: string
          updated_at?: string
        }
        Update: {
          contado_por?: string
          contagem_id?: string
          created_at?: string
          diferenca?: number | null
          id?: string
          insumo_id?: string | null
          observacoes?: string | null
          produto_id?: string | null
          quantidade_anterior?: number | null
          quantidade_contada?: number
          tipo_item?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contagens_estoque_itens_contagem_id_fkey"
            columns: ["contagem_id"]
            isOneToOne: false
            referencedRelation: "contagens_estoque"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contagens_estoque_itens_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contagens_estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      emitentes_fornecedores_mapping: {
        Row: {
          atualizado_em: string | null
          created_at: string
          emitente_cnpj: string
          emitente_nome: string | null
          fornecedor_id: string
          id: string
          pizzaria_id: string
          updated_at: string
        }
        Insert: {
          atualizado_em?: string | null
          created_at?: string
          emitente_cnpj: string
          emitente_nome?: string | null
          fornecedor_id: string
          id?: string
          pizzaria_id: string
          updated_at?: string
        }
        Update: {
          atualizado_em?: string | null
          created_at?: string
          emitente_cnpj?: string
          emitente_nome?: string | null
          fornecedor_id?: string
          id?: string
          pizzaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emitentes_fornecedores_mapping_fornecedor_fk"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emitentes_fornecedores_mapping_pizzaria_fk"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque: {
        Row: {
          created_at: string
          data_entrada: string
          fornecedor_id: string | null
          id: string
          insumo_id: string
          marca_id: string | null
          observacoes: string | null
          pizzaria_id: string
          quantidade_total: number
          status_conferencia: string
          tipo_entrada: string
          unidade_compra_id: string | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_entrada: string
          fornecedor_id?: string | null
          id?: string
          insumo_id: string
          marca_id?: string | null
          observacoes?: string | null
          pizzaria_id: string
          quantidade_total: number
          status_conferencia: string
          tipo_entrada: string
          unidade_compra_id?: string | null
          updated_at?: string
          valor_total: number
        }
        Update: {
          created_at?: string
          data_entrada?: string
          fornecedor_id?: string | null
          id?: string
          insumo_id?: string
          marca_id?: string | null
          observacoes?: string | null
          pizzaria_id?: string
          quantidade_total?: number
          status_conferencia?: string
          tipo_entrada?: string
          unidade_compra_id?: string | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "estoque_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_unidade_compra_id_fkey"
            columns: ["unidade_compra_id"]
            isOneToOne: false
            referencedRelation: "unidades_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      fichas_tecnicas: {
        Row: {
          atualizado_em: string | null
          atualizado_por: string | null
          criado_em: string | null
          criado_por: string | null
          custo_por_unidade: number | null
          id: string
          pizzaria_id: string
          produto_id: string
          rendimento: number | null
          tipo: string
          unidade_conversao: string | null
          unidade_rendimento: string | null
        }
        Insert: {
          atualizado_em?: string | null
          atualizado_por?: string | null
          criado_em?: string | null
          criado_por?: string | null
          custo_por_unidade?: number | null
          id?: string
          pizzaria_id: string
          produto_id: string
          rendimento?: number | null
          tipo?: string
          unidade_conversao?: string | null
          unidade_rendimento?: string | null
        }
        Update: {
          atualizado_em?: string | null
          atualizado_por?: string | null
          criado_em?: string | null
          criado_por?: string | null
          custo_por_unidade?: number | null
          id?: string
          pizzaria_id?: string
          produto_id?: string
          rendimento?: number | null
          tipo?: string
          unidade_conversao?: string | null
          unidade_rendimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fichas_tecnicas_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      fichas_tecnicas_itens: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          ficha_tecnica_id: string
          id: string
          insumo_id: string
          produto_id: string | null
          quantidade_bruta: number
          quantidade_liquida: number
          tipo_item: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          ficha_tecnica_id: string
          id?: string
          insumo_id: string
          produto_id?: string | null
          quantidade_bruta: number
          quantidade_liquida: number
          tipo_item?: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          ficha_tecnica_id?: string
          id?: string
          insumo_id?: string
          produto_id?: string | null
          quantidade_bruta?: number
          quantidade_liquida?: number
          tipo_item?: string
        }
        Relationships: [
          {
            foreignKeyName: "fichas_tecnicas_itens_ficha_tecnica_id_fkey"
            columns: ["ficha_tecnica_id"]
            isOneToOne: false
            referencedRelation: "fichas_tecnicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_itens_ficha_tecnica_id_fkey"
            columns: ["ficha_tecnica_id"]
            isOneToOne: false
            referencedRelation: "view_fichas_tecnicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_itens_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      fichas_tecnicas_ordem: {
        Row: {
          atualizado_em: string
          created_at: string
          id: string
          ordem: number
          pizzaria_id: string
          produto_id: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          created_at?: string
          id?: string
          ordem: number
          pizzaria_id: string
          produto_id: string
          tipo: string
        }
        Update: {
          atualizado_em?: string
          created_at?: string
          id?: string
          ordem?: number
          pizzaria_id?: string
          produto_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "fichas_tecnicas_ordem_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_ordem_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          atualizado_por: string | null
          created_at: string
          criado_por: string | null
          dias_entrega: Database["public"]["Enums"]["dia_semana"][] | null
          dias_pedido: Database["public"]["Enums"]["dia_semana"][] | null
          email: string | null
          id: string
          inativo: boolean | null
          nome_empresa: string
          nome_vendedor: string | null
          pizzaria_id: string
          prazo_entrega: number | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          atualizado_por?: string | null
          created_at?: string
          criado_por?: string | null
          dias_entrega?: Database["public"]["Enums"]["dia_semana"][] | null
          dias_pedido?: Database["public"]["Enums"]["dia_semana"][] | null
          email?: string | null
          id?: string
          inativo?: boolean | null
          nome_empresa: string
          nome_vendedor?: string | null
          pizzaria_id: string
          prazo_entrega?: number | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          atualizado_por?: string | null
          created_at?: string
          criado_por?: string | null
          dias_entrega?: Database["public"]["Enums"]["dia_semana"][] | null
          dias_pedido?: Database["public"]["Enums"]["dia_semana"][] | null
          email?: string | null
          id?: string
          inativo?: boolean | null
          nome_empresa?: string
          nome_vendedor?: string | null
          pizzaria_id?: string
          prazo_entrega?: number | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores_categorias: {
        Row: {
          categoria_id: string
          created_at: string
          fornecedor_id: string
          id: string
          updated_at: string
        }
        Insert: {
          categoria_id: string
          created_at?: string
          fornecedor_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          categoria_id?: string
          created_at?: string
          fornecedor_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_categoria"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fornecedor"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_categorias_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_importacoes: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          data_importacao: string | null
          desfeito: boolean | null
          detalhes: Json | null
          id: string
          pizzaria_id: string
          quantidade_atualizados: number | null
          quantidade_novos: number | null
          quantidade_produtos: number
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_importacao?: string | null
          desfeito?: boolean | null
          detalhes?: Json | null
          id?: string
          pizzaria_id: string
          quantidade_atualizados?: number | null
          quantidade_novos?: number | null
          quantidade_produtos: number
          usuario_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_importacao?: string | null
          desfeito?: boolean | null
          detalhes?: Json | null
          id?: string
          pizzaria_id?: string
          quantidade_atualizados?: number | null
          quantidade_novos?: number | null
          quantidade_produtos?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_importacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      insumos: {
        Row: {
          categoria_id: string | null
          como_comprado: string[] | null
          created_at: string
          curva_abc: string | null
          data_ultimo_custo: string | null
          estoque_atual: number | null
          estoque_maximo: number | null
          estoque_minimo: number | null
          fator_conversao: number | null
          fornecedor_2_id: string | null
          fornecedor_3_id: string | null
          fornecedor_id: string | null
          id: string
          import_id: string | null
          inativo: boolean | null
          nome: string
          pizzaria_id: string
          ponto_pedido: number | null
          ultimo_custo: number | null
          unidade_conversao:
            | Database["public"]["Enums"]["unidade_conversao_tipo"]
            | null
          unidade_medida_id: string | null
          unidades_contagem_ids: string[] | null
          updated_at: string
        }
        Insert: {
          categoria_id?: string | null
          como_comprado?: string[] | null
          created_at?: string
          curva_abc?: string | null
          data_ultimo_custo?: string | null
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          fator_conversao?: number | null
          fornecedor_2_id?: string | null
          fornecedor_3_id?: string | null
          fornecedor_id?: string | null
          id?: string
          import_id?: string | null
          inativo?: boolean | null
          nome: string
          pizzaria_id: string
          ponto_pedido?: number | null
          ultimo_custo?: number | null
          unidade_conversao?:
            | Database["public"]["Enums"]["unidade_conversao_tipo"]
            | null
          unidade_medida_id?: string | null
          unidades_contagem_ids?: string[] | null
          updated_at?: string
        }
        Update: {
          categoria_id?: string | null
          como_comprado?: string[] | null
          created_at?: string
          curva_abc?: string | null
          data_ultimo_custo?: string | null
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          fator_conversao?: number | null
          fornecedor_2_id?: string | null
          fornecedor_3_id?: string | null
          fornecedor_id?: string | null
          id?: string
          import_id?: string | null
          inativo?: boolean | null
          nome?: string
          pizzaria_id?: string
          ponto_pedido?: number | null
          ultimo_custo?: number | null
          unidade_conversao?:
            | Database["public"]["Enums"]["unidade_conversao_tipo"]
            | null
          unidade_medida_id?: string | null
          unidades_contagem_ids?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insumos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insumos_fornecedor_2_id_fkey"
            columns: ["fornecedor_2_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insumos_fornecedor_3_id_fkey"
            columns: ["fornecedor_3_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insumos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insumos_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insumos_unidade_medida_id_fkey"
            columns: ["unidade_medida_id"]
            isOneToOne: false
            referencedRelation: "unidades_medida"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_estoque: {
        Row: {
          categoria_contabil: Database["public"]["Enums"]["categoria_contabil"]
          contabiliza_cmv: boolean
          created_at: string
          data_ultimo_custo: string | null
          estoque_atual: number | null
          estoque_maximo: number | null
          estoque_minimo: number | null
          id: string
          inativo: boolean | null
          insumo_id: string | null
          nome: string
          pizzaria_id: string
          ponto_pedido: number | null
          produto_id: string | null
          tipo_item: Database["public"]["Enums"]["tipo_item_estoque"]
          ultimo_custo: number | null
          unidade_medida_id: string | null
          updated_at: string
        }
        Insert: {
          categoria_contabil: Database["public"]["Enums"]["categoria_contabil"]
          contabiliza_cmv?: boolean
          created_at?: string
          data_ultimo_custo?: string | null
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          inativo?: boolean | null
          insumo_id?: string | null
          nome: string
          pizzaria_id: string
          ponto_pedido?: number | null
          produto_id?: string | null
          tipo_item: Database["public"]["Enums"]["tipo_item_estoque"]
          ultimo_custo?: number | null
          unidade_medida_id?: string | null
          updated_at?: string
        }
        Update: {
          categoria_contabil?: Database["public"]["Enums"]["categoria_contabil"]
          contabiliza_cmv?: boolean
          created_at?: string
          data_ultimo_custo?: string | null
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          inativo?: boolean | null
          insumo_id?: string | null
          nome?: string
          pizzaria_id?: string
          ponto_pedido?: number | null
          produto_id?: string | null
          tipo_item?: Database["public"]["Enums"]["tipo_item_estoque"]
          ultimo_custo?: number | null
          unidade_medida_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_estoque_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_estoque_unidade_medida_id_fkey"
            columns: ["unidade_medida_id"]
            isOneToOne: false
            referencedRelation: "unidades_medida"
            referencedColumns: ["id"]
          },
        ]
      }
      locais: {
        Row: {
          created_at: string
          id: string
          nome: string
          ordem: number | null
          pizzaria_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          ordem?: number | null
          pizzaria_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          ordem?: number | null
          pizzaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locais_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      locais_insumos: {
        Row: {
          created_at: string
          forma_contagem: string | null
          id: string
          insumo_id: string
          local_id: string
          ordem: number | null
          pizzaria_id: string
          produto_id: string | null
          tipo_item: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          forma_contagem?: string | null
          id?: string
          insumo_id: string
          local_id: string
          ordem?: number | null
          pizzaria_id: string
          produto_id?: string | null
          tipo_item?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          forma_contagem?: string | null
          id?: string
          insumo_id?: string
          local_id?: string
          ordem?: number | null
          pizzaria_id?: string
          produto_id?: string | null
          tipo_item?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locais_insumos_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locais_insumos_local_id_fkey"
            columns: ["local_id"]
            isOneToOne: false
            referencedRelation: "locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locais_insumos_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locais_insumos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      marcas: {
        Row: {
          created_at: string
          id: string
          nome: string
          pizzaria_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          pizzaria_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          pizzaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marcas_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      marcas_fornecedor: {
        Row: {
          created_at: string
          fornecedor_id: string
          id: string
          marca_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fornecedor_id: string
          id?: string
          marca_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fornecedor_id?: string
          id?: string
          marca_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marcas_fornecedor_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marcas_fornecedor_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      marcas_insumos: {
        Row: {
          created_at: string
          fornecedor_id: string
          id: string
          insumo_id: string
          marca_id: string
          pizzaria_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fornecedor_id: string
          id?: string
          insumo_id: string
          marca_id: string
          pizzaria_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fornecedor_id?: string
          id?: string
          insumo_id?: string
          marca_id?: string
          pizzaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marcas_insumos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marcas_insumos_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marcas_insumos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marcas_insumos_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_fiscais: {
        Row: {
          atualizado_em: string | null
          chave_acesso: string
          created_at: string
          data_emissao: string
          data_importacao: string | null
          emitente_cnpj: string | null
          emitente_nome: string | null
          fornecedor_id: string | null
          historico_etapas: Json[] | null
          id: string
          importado_em: string | null
          natureza_operacao: string | null
          numero: string
          pizzaria_id: string
          processado: boolean
          serie: string
          status: Database["public"]["Enums"]["nota_fiscal_status"]
          tipo_entrada: string | null
          updated_at: string
          valor_total: number
          xml_content: string | null
        }
        Insert: {
          atualizado_em?: string | null
          chave_acesso: string
          created_at?: string
          data_emissao: string
          data_importacao?: string | null
          emitente_cnpj?: string | null
          emitente_nome?: string | null
          fornecedor_id?: string | null
          historico_etapas?: Json[] | null
          id?: string
          importado_em?: string | null
          natureza_operacao?: string | null
          numero: string
          pizzaria_id: string
          processado?: boolean
          serie: string
          status?: Database["public"]["Enums"]["nota_fiscal_status"]
          tipo_entrada?: string | null
          updated_at?: string
          valor_total: number
          xml_content?: string | null
        }
        Update: {
          atualizado_em?: string | null
          chave_acesso?: string
          created_at?: string
          data_emissao?: string
          data_importacao?: string | null
          emitente_cnpj?: string | null
          emitente_nome?: string | null
          fornecedor_id?: string | null
          historico_etapas?: Json[] | null
          id?: string
          importado_em?: string | null
          natureza_operacao?: string | null
          numero?: string
          pizzaria_id?: string
          processado?: boolean
          serie?: string
          status?: Database["public"]["Enums"]["nota_fiscal_status"]
          tipo_entrada?: string | null
          updated_at?: string
          valor_total?: number
          xml_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_fiscais_itens: {
        Row: {
          codigo_fornecedor: string | null
          created_at: string
          data_mapeamento: string | null
          descricao: string
          id: string
          insumo_id: string | null
          item_estoque_id: string | null
          mapeado_por: string | null
          marca_id: string | null
          nota_fiscal_id: string
          numero_item: number
          produto_id: string | null
          quantidade: number
          quantidade_por_unidade: number | null
          status: string | null
          status_mapeamento:
            | Database["public"]["Enums"]["nota_fiscal_item_status_mapeamento"]
            | null
          tipo: string | null
          unidade: string
          updated_at: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          codigo_fornecedor?: string | null
          created_at?: string
          data_mapeamento?: string | null
          descricao: string
          id?: string
          insumo_id?: string | null
          item_estoque_id?: string | null
          mapeado_por?: string | null
          marca_id?: string | null
          nota_fiscal_id: string
          numero_item?: number
          produto_id?: string | null
          quantidade: number
          quantidade_por_unidade?: number | null
          status?: string | null
          status_mapeamento?:
            | Database["public"]["Enums"]["nota_fiscal_item_status_mapeamento"]
            | null
          tipo?: string | null
          unidade: string
          updated_at?: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          codigo_fornecedor?: string | null
          created_at?: string
          data_mapeamento?: string | null
          descricao?: string
          id?: string
          insumo_id?: string | null
          item_estoque_id?: string | null
          mapeado_por?: string | null
          marca_id?: string | null
          nota_fiscal_id?: string
          numero_item?: number
          produto_id?: string | null
          quantidade?: number
          quantidade_por_unidade?: number | null
          status?: string | null
          status_mapeamento?:
            | Database["public"]["Enums"]["nota_fiscal_item_status_mapeamento"]
            | null
          tipo?: string | null
          unidade?: string
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_itens_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_itens_item_estoque_fk"
            columns: ["item_estoque_id"]
            isOneToOne: false
            referencedRelation: "itens_estoque"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_itens_item_estoque_id_fkey"
            columns: ["item_estoque_id"]
            isOneToOne: false
            referencedRelation: "itens_estoque"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_itens_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_itens_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          atualizado_em: string
          criado_em: string
          email: string
          funcao: Database["public"]["Enums"]["funcao_sistema"]
          id: string
          nome: string
          primeiro_acesso: boolean | null
          senha_temporaria: string | null
          senha_temporaria_usada: boolean | null
          sobrenome: string | null
          ultima_alteracao_senha: string | null
          ultima_atividade: string | null
          url_avatar: string | null
          whatsapp: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          email: string
          funcao?: Database["public"]["Enums"]["funcao_sistema"]
          id: string
          nome: string
          primeiro_acesso?: boolean | null
          senha_temporaria?: string | null
          senha_temporaria_usada?: boolean | null
          sobrenome?: string | null
          ultima_alteracao_senha?: string | null
          ultima_atividade?: string | null
          url_avatar?: string | null
          whatsapp?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          email?: string
          funcao?: Database["public"]["Enums"]["funcao_sistema"]
          id?: string
          nome?: string
          primeiro_acesso?: boolean | null
          senha_temporaria?: string | null
          senha_temporaria_usada?: boolean | null
          sobrenome?: string | null
          ultima_alteracao_senha?: string | null
          ultima_atividade?: string | null
          url_avatar?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      pizzarias: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          criado_por: string | null
          data_inicio_teste: string | null
          dias_teste: number | null
          id: string
          nome: string
          subscription_ends_at: string | null
          subscription_starts_at: string | null
          tipo_assinatura: string
          url_logo: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_inicio_teste?: string | null
          dias_teste?: number | null
          id?: string
          nome: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          tipo_assinatura: string
          url_logo?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_inicio_teste?: string | null
          dias_teste?: number | null
          id?: string
          nome?: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          tipo_assinatura?: string
          url_logo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pizzarias_created_by_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          atualizado_em: string | null
          categoria_id: string
          created_at: string
          data_ultimo_custo: string | null
          deleted_at: string | null
          id: string
          import_id: string | null
          importado_em: string | null
          inativo: boolean | null
          nome: string
          pizzaria_id: string
          preco: number | null
          ultimo_custo: number | null
          updated_at: string
        }
        Insert: {
          atualizado_em?: string | null
          categoria_id: string
          created_at?: string
          data_ultimo_custo?: string | null
          deleted_at?: string | null
          id?: string
          import_id?: string | null
          importado_em?: string | null
          inativo?: boolean | null
          nome: string
          pizzaria_id: string
          preco?: number | null
          ultimo_custo?: number | null
          updated_at?: string
        }
        Update: {
          atualizado_em?: string | null
          categoria_id?: string
          created_at?: string
          data_ultimo_custo?: string | null
          deleted_at?: string | null
          id?: string
          import_id?: string | null
          importado_em?: string | null
          inativo?: boolean | null
          nome?: string
          pizzaria_id?: string
          preco?: number | null
          ultimo_custo?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos_xml_mapping: {
        Row: {
          created_at: string
          descricao_xml: string
          hits: number
          id: string
          insumo_id: string
          last_used: string
          marca_id: string | null
          pizzaria_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao_xml: string
          hits?: number
          id?: string
          insumo_id: string
          last_used?: string
          marca_id?: string | null
          pizzaria_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao_xml?: string
          hits?: number
          id?: string
          insumo_id?: string
          last_used?: string
          marca_id?: string | null
          pizzaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_xml_mapping_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_xml_mapping_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_xml_mapping_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_atividades: {
        Row: {
          acao: string
          criado_em: string
          detalhes: Json | null
          id: string
          pizzaria_id: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string
          detalhes?: Json | null
          id?: string
          pizzaria_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string
          detalhes?: Json | null
          id?: string
          pizzaria_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      test_executions: {
        Row: {
          duration: number | null
          error_message: string | null
          executed_at: string | null
          executed_by: string | null
          id: string
          passed_steps: number | null
          result: Json
          scenario: string
          status: string
          steps: Json | null
          total_steps: number | null
          type: Database["public"]["Enums"]["test_type"]
        }
        Insert: {
          duration?: number | null
          error_message?: string | null
          executed_at?: string | null
          executed_by?: string | null
          id?: string
          passed_steps?: number | null
          result: Json
          scenario: string
          status?: string
          steps?: Json | null
          total_steps?: number | null
          type: Database["public"]["Enums"]["test_type"]
        }
        Update: {
          duration?: number | null
          error_message?: string | null
          executed_at?: string | null
          executed_by?: string | null
          id?: string
          passed_steps?: number | null
          result?: Json
          scenario?: string
          status?: string
          steps?: Json | null
          total_steps?: number | null
          type?: Database["public"]["Enums"]["test_type"]
        }
        Relationships: []
      }
      unidades_compra: {
        Row: {
          created_at: string
          id: string
          nome: string
          pizzaria_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          pizzaria_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          pizzaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidades_compra_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades_contagem: {
        Row: {
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      unidades_medida: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          sigla: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          sigla: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          sigla?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios_pizzarias: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          funcao: Database["public"]["Enums"]["funcao_sistema"]
          id: string
          online: boolean | null
          pizzaria_id: string
          ultimo_acesso: string | null
          usuario_id: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          funcao?: Database["public"]["Enums"]["funcao_sistema"]
          id?: string
          online?: boolean | null
          pizzaria_id: string
          ultimo_acesso?: string | null
          usuario_id: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          funcao?: Database["public"]["Enums"]["funcao_sistema"]
          id?: string
          online?: boolean | null
          pizzaria_id?: string
          ultimo_acesso?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pizzarias_users_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pizzarias_users_user_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_fichas_tecnicas: {
        Row: {
          atualizado_em: string | null
          atualizado_por: string | null
          atualizado_por_nome: string | null
          criado_em: string | null
          criado_por: string | null
          criado_por_nome: string | null
          custo_por_unidade: number | null
          id: string | null
          pizzaria_id: string | null
          produto_id: string | null
          rendimento: number | null
          tipo: string | null
          unidade_rendimento: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fichas_tecnicas_pizzaria_id_fkey"
            columns: ["pizzaria_id"]
            isOneToOne: false
            referencedRelation: "pizzarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_reset_user_password: {
        Args: {
          admin_user_id: string
          target_user_email: string
        }
        Returns: undefined
      }
      can_delete_fornecedor: {
        Args: {
          p_fornecedor_id: string
        }
        Returns: boolean
      }
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_email_exists: {
        Args: {
          email_to_check: string
        }
        Returns: boolean
      }
      check_master_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_master_role: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_nota_fiscal_exists: {
        Args: {
          p_numero: string
          p_pizzaria_id: string
        }
        Returns: boolean
      }
      check_pizzaria_access: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_pizzaria_access_optimized: {
        Args: {
          user_id: string
          pizzaria_id: string
        }
        Returns: boolean
      }
      check_pizzaria_access_v2: {
        Args: {
          user_id: string
          pizzaria_id: string
        }
        Returns: boolean
      }
      check_pizzaria_user_access: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_pizzaria_user_association_access: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_trial_period: {
        Args: {
          pizzaria_id: string
        }
        Returns: boolean
      }
      check_user_exists: {
        Args: {
          email: string
        }
        Returns: boolean
      }
      check_user_pizzaria_role: {
        Args: {
          user_id: string
          pizzaria_id: string
          required_role: Database["public"]["Enums"]["funcao_sistema"]
        }
        Returns: boolean
      }
      check_user_role: {
        Args: {
          _user_id: string
          _pizzaria_id: string
          _role: Database["public"]["Enums"]["funcao_sistema"]
        }
        Returns: boolean
      }
      create_fornecedor: {
        Args: {
          p_fornecedor_data: Database["public"]["CompositeTypes"]["fornecedor_input"]
          p_categorias: string[]
        }
        Returns: string
      }
      create_new_user: {
        Args: {
          p_nome: string
          p_email: string
          p_funcao: Database["public"]["Enums"]["funcao_sistema"]
          p_pizzaria_id: string
          p_whatsapp: string
          p_ativo?: boolean
        }
        Returns: string
      }
      delete_fornecedor: {
        Args: {
          p_fornecedor_id: string
        }
        Returns: undefined
      }
      get_all_users_v2: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nome: string
          email: string
          pizzaria_nome: string
          pizzaria_id: string
          funcao: Database["public"]["Enums"]["funcao_sistema"]
          criado_em: string
          online: boolean
          ultimo_acesso: string
          ativo: boolean
        }[]
      }
      get_notas_fiscais_status: {
        Args: {
          p_pizzaria_id: string
        }
        Returns: {
          status: string
          quantidade: number
          primeira_nota: string
          ultima_nota: string
          valor_total: number
        }[]
      }
      get_pizzaria_categorias: {
        Args: {
          p_pizzaria_id: string
        }
        Returns: {
          id: string
          nome: string
        }[]
      }
      get_user_pizzarias: {
        Args: {
          user_id: string
        }
        Returns: {
          pizzaria_id: string
          pizzaria_nome: string
          pizzaria_url_logo: string
        }[]
      }
      get_user_pizzarias_v2:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              pizzaria_id: string
              pizzaria_nome: string
              pizzaria_url_logo: string
              pizzaria_ativo: boolean
              pizzaria_tipo_assinatura: string
              pizzaria_dias_teste: number
              pizzaria_criado_em: string
            }[]
          }
        | {
            Args: {
              user_id: string
            }
            Returns: {
              pizzaria_id: string
              pizzaria_nome: string
              pizzaria_url_logo: string
              pizzaria_ativo: boolean
              pizzaria_tipo_assinatura: string
              pizzaria_dias_teste: number
              pizzaria_criado_em: string
            }[]
          }
      get_user_profile: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          nome: string
          sobrenome: string
          email: string
          url_avatar: string
          ultima_atividade: string
          criado_em: string
          atualizado_em: string
          funcao: Database["public"]["Enums"]["funcao_sistema"]
          primeiro_acesso: boolean
          senha_temporaria: string
        }[]
      }
      insert_batch_fornecedores: {
        Args: {
          p_pizzaria_id: string
          p_nomes: string[]
        }
        Returns: undefined
      }
      insert_default_categories: {
        Args: {
          p_pizzaria_id: string
        }
        Returns: undefined
      }
      insert_default_product_categories: {
        Args: {
          p_pizzaria_id: string
        }
        Returns: undefined
      }
      is_master: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_master_optimized: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_master_safe: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_pizzaria_active: {
        Args: {
          pizzaria_id: string
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          user_id: string
          pizzaria_id: string
          action: string
          details?: Json
        }
        Returns: undefined
      }
      manage_categorias_produtos: {
        Args: {
          p_pizzaria_id: string
          p_categorias: string[]
        }
        Returns: undefined
      }
      manage_pizzaria: {
        Args: {
          p_nome: string
          p_tipo_assinatura: string
          p_id?: string
          p_url_logo?: string
          p_dias_teste?: number
          p_ativo?: boolean
        }
        Returns: string
      }
      normalize_text: {
        Args: {
          "": string
        }
        Returns: string
      }
      request_password_reset: {
        Args: {
          admin_user_id: string
          target_user_email: string
        }
        Returns: undefined
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      update_fornecedor: {
        Args: {
          p_fornecedor_id: string
          p_fornecedor_data: Database["public"]["CompositeTypes"]["fornecedor_input"]
          p_categorias: string[]
        }
        Returns: string
      }
      update_primeiro_acesso: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      validate_reset_password_request: {
        Args: {
          admin_user_id: string
          target_user_email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      categoria_contabil:
        | "materia_prima"
        | "embalagem"
        | "material_limpeza"
        | "material_escritorio"
        | "utensilios"
        | "outros"
      contagem_status: "em_andamento" | "finalizada" | "cancelada"
      dia_semana: "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado"
      funcao_sistema: "master" | "admin" | "gerente" | "estoquista"
      nota_fiscal_item_status: "pendente" | "mapeado" | "ignorado"
      nota_fiscal_item_status_mapeamento: "pendente" | "mapeado" | "ignorado"
      nota_fiscal_status:
        | "pendente"
        | "pendente_mapeamento"
        | "pendente_confirmacao"
        | "pendente_conferencia_fisica"
        | "conferida"
        | "conferida_com_alteracoes"
      test_type:
        | "link_validation"
        | "auth_flow"
        | "user_profile"
        | "password_reset"
        | "session"
        | "pizzaria_flow"
      tipo_item_estoque: "insumo" | "produto_acabado" | "semi_acabado"
      tipo_item_nota: "bebida" | "insumo"
      tipo_produto: "pizza" | "producao_interna" | "revenda"
      unidade_conversao_tipo: "un" | "g" | "ml"
    }
    CompositeTypes: {
      fornecedor_input: {
        nome_empresa: string | null
        nome_vendedor: string | null
        whatsapp: string | null
        email: string | null
        dias_pedido: Database["public"]["Enums"]["dia_semana"][] | null
        dias_entrega: Database["public"]["Enums"]["dia_semana"][] | null
        pizzaria_id: string | null
        inativo: boolean | null
        prazo_entrega: number | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
