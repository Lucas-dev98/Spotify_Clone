/**
 * 🎨 Design System Component Examples
 * How to use the new components and theme system
 */

// ============================================
// 1. USANDO COLORS
// ============================================

import { colors } from '../theme/colors';

// Antes:
const containerStyle = { backgroundColor: '#fff' };

// Depois:
const containerStyle = { backgroundColor: colors.background };

// Com estados:
export function MyComponent() {
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text.primary }}>Título</Text>
      <Text style={{ color: colors.text.secondary }}>Subtítulo</Text>
      <Text style={{ color: colors.text.tertiary }}>Terciário</Text>
    </View>
  );
}


// ============================================
// 2. USANDO TYPOGRAPHY
// ============================================

import { typography } from '../theme/typography';

// Antes:
const titleStyle = { fontSize: 20, fontWeight: '700' };

// Depois:
const titleStyle = typography.headingMedium;

// Todos os níveis:
export function TypographyExamples() {
  return (
    <View>
      <Text style={typography.display}>Display (32px, 800)</Text>
      <Text style={typography.headingLarge}>Heading Large (24px, 700)</Text>
      <Text style={typography.headingMedium}>Heading Medium (20px, 700)</Text>
      <Text style={typography.headingSmall}>Heading Small (16px, 700)</Text>
      <Text style={typography.bodyLarge}>Body Large (16px, 400)</Text>
      <Text style={typography.bodyMedium}>Body Medium (14px, 400)</Text>
      <Text style={typography.bodySmall}>Body Small (12px, 400)</Text>
      <Text style={typography.label}>Label (12px, 600)</Text>
      <Text style={typography.caption}>Caption (11px, 500)</Text>
    </View>
  );
}


// ============================================
// 3. USANDO SPACING
// ============================================

import { spacing, borderRadius, shadows } from '../theme/spacing';

// Antes:
const containerStyle = { padding: 12, margin: 16, borderRadius: 8 };

// Depois:
const containerStyle = {
  padding: spacing.md,      // 12px
  margin: spacing.lg,       // 16px
  borderRadius: borderRadius.md  // 8px
};

// Todos os valores:
export function SpacingExamples() {
  return (
    <View>
      {/* Spacing */}
      <View style={{ marginBottom: spacing.xs }}>Xs: 4px</View>
      <View style={{ marginBottom: spacing.sm }}>Sm: 8px</View>
      <View style={{ marginBottom: spacing.md }}>Md: 12px</View>
      <View style={{ marginBottom: spacing.lg }}>Lg: 16px</View>
      <View style={{ marginBottom: spacing.xl }}>Xl: 24px</View>
      <View style={{ marginBottom: spacing.xxl }}>Xxl: 32px</View>
      
      {/* Border Radius */}
      <View style={{ borderRadius: borderRadius.none }}>No radius</View>
      <View style={{ borderRadius: borderRadius.sm }}>4px</View>
      <View style={{ borderRadius: borderRadius.md }}>8px</View>
      <View style={{ borderRadius: borderRadius.lg }}>12px</View>
      <View style={{ borderRadius: borderRadius.circle }}>Circle</View>
      
      {/* Shadows */}
      <View style={[{ padding: spacing.md }, shadows.sm]}>Sm shadow</View>
      <View style={[{ padding: spacing.md }, shadows.md]}>Md shadow</View>
      <View style={[{ padding: spacing.md }, shadows.lg]}>Lg shadow</View>
    </View>
  );
}


// ============================================
// 4. USANDO BADGE COMPONENT
// ============================================

import Badge from '../components/Badge';

export function BadgeExamples() {
  return (
    <View style={{ gap: spacing.md }}>
      <Badge label="Disponível" variant="success" size="md" icon="✓" />
      <Badge label="Premium" variant="primary" size="lg" />
      <Badge label="Erro" variant="error" size="sm" />
      <Badge label="Atenção" variant="warning" size="md" />
      <Badge label="Info" variant="info" size="md" />
      <Badge label="Secundário" variant="secondary" size="md" />
    </View>
  );
}


// ============================================
// 5. USANDO CARD COMPONENT
// ============================================

import Card from '../components/Card';

export function CardExamples() {
  return (
    <View style={{ gap: spacing.lg }}>
      <Card elevation="sm">
        <Text>Subtle elevation</Text>
      </Card>
      
      <Card elevation="md" variant="surfaceLight">
        <Text>Medium card</Text>
      </Card>
      
      <Card elevation="lg" onPress={() => console.log('Pressed!')}>
        <Text>Clickable card with large elevation</Text>
      </Card>
      
      <Card elevation="xl" variant="primary">
        <Text style={{ color: colors.text.primary }}>Primary variant</Text>
      </Card>
    </View>
  );
}


// ============================================
// 6. USANDO LAYOUT UTILITIES
// ============================================

import { FlexRow, FlexCol, Spacer } from '../components/Layout';

export function LayoutExamples() {
  return (
    <View>
      {/* FlexRow */}
      <FlexRow gap="lg" align="center" justify="space-between">
        <Text>Left</Text>
        <Text>Center</Text>
        <Text>Right</Text>
      </FlexRow>
      
      <Spacer size="lg" />
      
      {/* FlexCol */}
      <FlexCol gap="md" align="center">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </FlexCol>
      
      <Spacer size="xl" />
      
      {/* Mixed */}
      <FlexRow gap="md" align="center">
        <View style={{ width: 40, height: 40, backgroundColor: colors.primary }} />
        <FlexCol gap="xs">
          <Text style={typography.bodyMedium}>Title</Text>
          <Text style={typography.bodySmall}>Subtitle</Text>
        </FlexCol>
      </FlexRow>
    </View>
  );
}


// ============================================
// 7. USANDO SKELETON LOADER
// ============================================

import SkeletonLoader from '../components/SkeletonLoader';

export function SkeletonExample() {
  return (
    <View style={{ gap: spacing.md }}>
      <SkeletonLoader width="100%" height={20} />
      <SkeletonLoader width="80%" height={16} />
      <SkeletonLoader width="60%" height={20} />
      
      {/* Para imagens */}
      <SkeletonLoader width={64} height={64} borderRadiusSize="md" />
    </View>
  );
}


// ============================================
// 8. COMPLETE COMPONENT EXAMPLE
// ============================================

export function CompleteExample() {
  return (
    <View style={{ 
      backgroundColor: colors.background,
      padding: spacing.lg,
      gap: spacing.xl 
    }}>
      {/* Header */}
      <View>
        <Text style={typography.headingLarge}>Spotify Clone</Text>
        <Text style={typography.bodySmall}>Descubra música nova</Text>
      </View>
      
      {/* Card com conteúdo */}
      <Card elevation="md">
        <FlexRow gap="md" align="center">
          <SkeletonLoader width={48} height={48} borderRadiusSize="md" />
          <FlexCol gap="xs" style={{ flex: 1 }}>
            <Text style={typography.bodyMedium}>Track Title</Text>
            <Text style={typography.bodySmall}>Artist Name</Text>
          </FlexCol>
          <Badge label="Play" variant="primary" size="sm" icon="▶️" />
        </FlexRow>
      </Card>
      
      {/* Multiple items */}
      <FlexCol gap="md">
        <Text style={typography.headingSmall}>Mais Músicas</Text>
        {[1, 2, 3].map((i) => (
          <Card key={i} elevation="sm">
            <FlexRow gap="md" align="center">
              <SkeletonLoader width={40} height={40} borderRadiusSize="sm" />
              <Text style={{ flex: 1, ...typography.bodySmall }}>Song {i}</Text>
            </FlexRow>
          </Card>
        ))}
      </FlexCol>
    </View>
  );
}


// ============================================
// 9. TEMA CUSTOMIZADO
// ============================================

import theme from '../theme';

export function ThemeAccessExample() {
  return (
    <View style={{
      backgroundColor: colors.background,
      padding: spacing.lg,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.lg,
    }}>
      <Text style={typography.headingSmall}>
        Headers com elevation layer
      </Text>
    </View>
  );
}


// ============================================
// 10. PADRÕES RECOMENDADOS
// ============================================

/**
 * ✅ DO
 */
export function GoodPatterns() {
  return (
    <View style={{ 
      backgroundColor: colors.background,
      padding: spacing.lg,
      gap: spacing.md
    }}>
      {/* Use theme values */}
      <Text style={typography.headingSmall}>Good</Text>
      
      {/* Use flex gaps */}
      <FlexCol gap="md">
        <View style={{ backgroundColor: colors.surfaceLight }} />
        <View style={{ backgroundColor: colors.surfaceLight }} />
      </FlexCol>
    </View>
  );
}

/**
 * ❌ DON'T
 */
export function BadPatterns() {
  return (
    <View style={{ 
      backgroundColor: '#0f0f0f',        // ❌ Hardcoded
      padding: 16,                      // ❌ Magic number
      marginBottom: 12,                 // ❌ Ad-hoc spacing
    }}>
      <Text style={{ 
        fontSize: 18,                   // ❌ Hardcoded size
        fontWeight: '700',              // ❌ Not using typography
        color: '#fff'                   // ❌ Hardcoded color
      }}>
        Bad
      </Text>
    </View>
  );
}


// ============================================
// 11. MIGRATION GUIDE
// ============================================

/*

Passo 1: Imports
  import { colors } from '../theme/colors';
  import { typography } from '../theme/typography';
  import { spacing, borderRadius, shadows } from '../theme/spacing';
  import Card from '../components/Card';
  import Badge from '../components/Badge';
  import { FlexRow, FlexCol, Spacer } from '../components/Layout';

Passo 2: Remover hardcoded values
  - Substitua cores hardcoded por colors.*
  - Substitua fontSize/fontWeight por typography.*
  - Substitua padding/margin por spacing.*
  - Substitua borderRadius hardcoded por borderRadius.*

Passo 3: Usar componentes reutilizáveis
  - Wraps em Card para containers elevados
  - Use Badge para status/labels
  - Use FlexRow/FlexCol para layouts com gaps
  - Use Spacer para espaçamento vertical/horizontal

Passo 4: Testar
  - Verifique contraste de cores
  - Verifique consistência de spacing
  - Teste em light/dark mode (futuro)

*/

export default {
  BadgeExamples,
  CardExamples,
  LayoutExamples,
  SkeletonExample,
  CompleteExample,
  GoodPatterns,
};
